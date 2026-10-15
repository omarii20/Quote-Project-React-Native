
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import {
  API_BASE_URL,
  ApiError,
  getFirebaseIdToken,
} from './apiClient';

const PDF_CACHE_DIRECTORY = `${RNFS.CachesDirectoryPath}/quotes`;

// Track active downloads to avoid concurrent writes
// to the same PDF file.
const activeDownloads = new Map<string, Promise<string>>();

function validateQuoteId(quoteId: number): void {
  if (!Number.isSafeInteger(quoteId) || quoteId <= 0) {
    throw new Error('Invalid quote ID');
  }
}

function getSafeQuoteNumber(quoteNumber: string): string {
  const safeQuoteNumber = quoteNumber
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  if (!safeQuoteNumber) {
    throw new Error('Invalid quote number');
  }

  return safeQuoteNumber;
}

async function removeFileIfExists(
  filePath: string,
): Promise<void> {
  if (await RNFS.exists(filePath)) {
    await RNFS.unlink(filePath);
  }
}

async function validatePdfFile(
  filePath: string,
): Promise<void> {
  const fileInfo = await RNFS.stat(filePath);

  if (Number(fileInfo.size) < 4) {
    throw new Error('Downloaded PDF is empty or incomplete');
  }

  const signature = await RNFS.read(
    filePath,
    4,
    0,
    'utf8',
  );

  if (signature !== '%PDF') {
    throw new Error('Downloaded file is not a valid PDF');
  }
}

async function performPdfDownload(
  quoteId: number,
  quoteNumber: string,
): Promise<string> {
  const token = await getFirebaseIdToken();

  await RNFS.mkdir(PDF_CACHE_DIRECTORY);

  const safeQuoteNumber = getSafeQuoteNumber(quoteNumber);

  // Include quote ID to avoid filename collisions.
  const filePath =
    `${PDF_CACHE_DIRECTORY}/${quoteId}_${safeQuoteNumber}.pdf`;

  const temporaryPath = `${filePath}.download`;

  try {
    await removeFileIfExists(temporaryPath);

    const result = await RNFS.downloadFile({
      fromUrl: `${API_BASE_URL}/quotes/${quoteId}/pdf`,
      toFile: temporaryPath,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      },
      connectionTimeout: 15000,
      readTimeout: 60000,
    }).promise;

    if (result.statusCode !== 200) {
      throw new ApiError(
        `PDF download failed: ${result.statusCode}`,
        result.statusCode,
      );
    }

    await validatePdfFile(temporaryPath);

    // Replace the cached file only after validation.
    await removeFileIfExists(filePath);
    await RNFS.moveFile(temporaryPath, filePath);

    return filePath;
  } catch (downloadError) {
    try {
      await removeFileIfExists(temporaryPath);
    } catch (cleanupError) {
      console.warn(
        'PDF temporary file cleanup failed:',
        cleanupError,
      );
    }

    throw downloadError;
  }
}

// Download a fresh PDF from the authenticated API.
// Concurrent requests for the same quote share one download.
export async function downloadQuotePdf(
  quoteId: number,
  quoteNumber: string,
): Promise<string> {
  validateQuoteId(quoteId);

  const safeQuoteNumber = getSafeQuoteNumber(quoteNumber);
  const downloadKey = `${quoteId}_${safeQuoteNumber}`;

  const existingDownload = activeDownloads.get(downloadKey);

  if (existingDownload) {
    return existingDownload;
  }

  const downloadPromise = performPdfDownload(
    quoteId,
    quoteNumber,
  );

  activeDownloads.set(downloadKey, downloadPromise);

  try {
    return await downloadPromise;
  } finally {
    activeDownloads.delete(downloadKey);
  }
}

// Download and share a fresh quote PDF.
export async function shareQuotePdf(
  quoteId: number,
  quoteNumber: string,
): Promise<void> {
  const filePath = await downloadQuotePdf(
    quoteId,
    quoteNumber,
  );

  const safeQuoteNumber = getSafeQuoteNumber(quoteNumber);

  // A separate directory for user-visible shared files.
  const shareDirectory =
    `${RNFS.CachesDirectoryPath}/quote-shares`;

  await RNFS.mkdir(shareDirectory);

  const shareFilePath =
    `${shareDirectory}/${safeQuoteNumber}.pdf`;

  // Ensure the shared file has the correct display name.
  await removeFileIfExists(shareFilePath);

  await RNFS.copyFile(filePath, shareFilePath);

  await Share.open({
    url: `file://${shareFilePath}`,
    type: 'application/pdf',
    filename: safeQuoteNumber,
    title: `שיתוף הצעת מחיר ${quoteNumber}`,
    failOnCancel: false,
  });
}