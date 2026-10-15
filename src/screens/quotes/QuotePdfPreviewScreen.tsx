import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {MainStackParamList} from '../../navigation/MainNavigator';
import {downloadQuotePdf, shareQuotePdf} from '../../api/quotePdf';
import {useTheme} from '../../context/ThemeContext';

type PreviewRoute = RouteProp<
  MainStackParamList,
  'QuotePdfPreview'
>;

type PreviewNavigation = NativeStackNavigationProp<
  MainStackParamList,
  'QuotePdfPreview'
>;

export default function QuotePdfPreviewScreen() {
  const route = useRoute<PreviewRoute>();
  const navigation = useNavigation<PreviewNavigation>();
  const {colors} = useTheme();

  const {quoteId, quoteNumber} = route.params;

  const [filePath, setFilePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const path = await downloadQuotePdf(
          quoteId,
          quoteNumber,
        );

        if (active) {
          setFilePath(path);
        }
      } catch (loadError) {
        console.error('Load PDF error:', loadError);

        if (active) {
          setErrorMessage('לא הצלחנו לטעון את הצעת המחיר.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      active = false;
    };
  }, [quoteId, quoteNumber]);

  const handleShare = async () => {
    if (sharing || loading) {
      return;
    }

    try {
      setSharing(true);
      await shareQuotePdf(quoteId, quoteNumber);
    } catch (shareError) {
      console.error('Share PDF error:', shareError);
      setErrorMessage('לא הצלחנו לשתף את הצעת המחיר.');
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="חזרה">
          <MaterialDesignIcons
            name="arrow-right"
            size={26}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {color: colors.textPrimary},
          ]}>
          {quoteNumber}.pdf
        </Text>

        <TouchableOpacity
          onPress={handleShare}
          disabled={sharing || loading}
          accessibilityRole="button"
          accessibilityLabel="שיתוף הצעת מחיר">
          {sharing ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <MaterialDesignIcons
              name="share-variant-outline"
              size={25}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
            <Text style={{color: colors.textSecondary}}>
              טוען הצעת מחיר...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.center}>
            <Text
              style={[
                styles.errorText,
                {color: colors.danger},
              ]}>
              {errorMessage}
            </Text>
          </View>
        ) : filePath ? (
          <Pdf
            source={{uri: `file://${filePath}`}}
            style={styles.pdf}
            enablePaging={false}
            horizontal={false}
            enableAntialiasing
            onError={pdfError => {
              console.error('PDF render error:', pdfError);
              setErrorMessage(
                'לא הצלחנו להציג את קובץ ה־PDF.',
              );
            }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },
});