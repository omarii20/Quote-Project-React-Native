import React from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useQuotes} from '../../context/QuotesContext';
import {useTheme} from '../../context/ThemeContext';

import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';

import type {MainStackParamList} from '../../navigation/MainNavigator';

type QuotesNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function QuotesScreen() {
  const navigation = useNavigation<QuotesNavigationProp>();
  const {colors} = useTheme();

  const {
    quotes,
    loading,
    error,
  } = useQuotes();

  const formatAmount = (value?: number | string) => {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
      return '₪0';
    }

    return `₪${amount.toLocaleString('he-IL')}`;
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return '';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('he-IL');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {color: colors.textPrimary},
            ]}>
            הצעות מחיר
          </Text>

          <View style={styles.quoteCount}>
            <Text
              style={[
                styles.quoteCountValue,
                {color: colors.primary},
              ]}>
              {quotes.length}
            </Text>

            <Text
              style={[
                styles.quoteCountLabel,
                {color: colors.textSecondary},
              ]}>
              הצעות
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text
              style={[
                styles.loadingText,
                {color: colors.textSecondary},
              ]}>
              טוען הצעות מחיר...
            </Text>
          </View>
        ) : error ? (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.errorText,
                {color: colors.danger},
              ]}>
              {error}
            </Text>
          </View>
        ) : quotes.length === 0 ? (
          <View
            style={[
              styles.emptyContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.emptyTitle,
                {color: colors.textPrimary},
              ]}>
              אין הצעות מחיר עדיין
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {color: colors.textSecondary},
              ]}>
              הצעות המחיר שלך יופיעו כאן.
            </Text>
          </View>
        ) : (
          quotes.map(quote => (
            <TouchableOpacity
              key={quote.id}
              style={[
                styles.quoteCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate(
                  'QuoteDetails',
                  {
                    quoteId: quote.id,
                  },
                )
              }>

              <View style={styles.quoteTopRow}>
                <Text
                  style={[
                    styles.quoteNumber,
                    {color: colors.textSecondary},
                  ]}>
                  {quote.quote_number}
                </Text>

                <QuoteStatusBadge status={quote.status} />
              </View>

              <Text
                style={[
                  styles.quoteTitle,
                  {color: colors.textPrimary},
                ]}>
                {quote.title ||
                  'הצעת מחיר ללא כותרת'}
              </Text>

              {quote.description ? (
                <Text
                  style={[
                    styles.quoteDescription,
                    {color: colors.textSecondary},
                  ]}
                  numberOfLines={2}>
                  {quote.description}
                </Text>
              ) : null}

              <View
                style={[
                  styles.quoteBottomRow,
                  {borderTopColor: colors.border},
                ]}>
                <View>
                  <Text
                    style={[
                      styles.dateLabel,
                      {color: colors.textSecondary},
                    ]}>
                    תאריך
                  </Text>

                  <Text
                    style={[
                      styles.quoteDate,
                      {color: colors.textPrimary},
                    ]}>
                    {formatDate(
                      quote.created_at,
                    )}
                  </Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text
                    style={[
                      styles.amountLabel,
                      {color: colors.textSecondary},
                    ]}>
                    סכום
                  </Text>

                  <Text
                    style={[
                      styles.quoteAmount,
                      {color: colors.textPrimary},
                    ]}>
                    {formatAmount(
                      quote.total ??
                        quote.subtotal,
                    )}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  header: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
  },

  quoteCount: {
    marginTop: 6,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },

  quoteCountValue: {
    fontSize: 17,
    fontWeight: '700',
  },

  quoteCountLabel: {
    fontSize: 14,
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  errorContainer: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'right',
  },

  emptyContainer: {
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  quoteCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 12,
  },

  quoteTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quoteNumber: {
    fontSize: 14,
    fontWeight: '600',
  },

  quoteTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },

  quoteDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
  },

  quoteBottomRow: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  dateLabel: {
    fontSize: 12,
    textAlign: 'right',
  },

  quoteDate: {
    marginTop: 4,
    fontSize: 14,
  },

  amountContainer: {
    alignItems: 'flex-end',
  },

  amountLabel: {
    fontSize: 12,
    textAlign: 'right',
  },

  quoteAmount: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },
});