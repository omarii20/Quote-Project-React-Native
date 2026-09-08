import {getAuth} from '@react-native-firebase/auth';

const API_BASE_URL = 'http://10.0.2.2:8080';

type ApiRequestOptions = RequestInit;

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}