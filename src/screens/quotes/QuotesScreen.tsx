import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';
import {useQuotes} from '../../context/QuotesContext';
import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';

export default function QuotesScreen() {
  const {
    quotes,
    loading,
    error,
  } = useQuotes();

  const formatAmount = (
    value?: number | string,
  ) => {
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>
            הצעות מחיר
          </Text>

          <Text style={styles.subtitle}>
            {quotes.length} הצעות
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text style={styles.loadingText}>
              טוען הצעות מחיר...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : quotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              אין הצעות מחיר עדיין
            </Text>

            <Text style={styles.emptySubtitle}>
              הצעות המחיר שלך יופיעו כאן.
            </Text>
          </View>
        ) : (
          quotes.map(quote => (
            <View
              key={quote.id}
              style={styles.quoteCard}>

              <View style={styles.quoteTopRow}>
                <Text style={styles.quoteNumber}>
                  {quote.quote_number}
                </Text>

                <QuoteStatusBadge status={quote.status} />
              </View>

              <Text style={styles.quoteTitle}>
                {quote.title ||
                  'הצעת מחיר ללא כותרת'}
              </Text>

              {quote.description ? (
                <Text
                  style={styles.quoteDescription}
                  numberOfLines={2}>
                  {quote.description}
                </Text>
              ) : null}

              <View style={styles.quoteBottomRow}>
                <View>
                  <Text style={styles.dateLabel}>
                    תאריך
                  </Text>

                  <Text style={styles.quoteDate}>
                    {formatDate(
                      quote.created_at,
                    )}
                  </Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>
                    סכום
                  </Text>

                  <Text style={styles.quoteAmount}>
                    {formatAmount(
                      quote.total ??
                        quote.subtotal,
                    )}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },

  errorContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'right',
  },

  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  quoteCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textSecondary,
  },

  quoteTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  quoteDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  quoteBottomRow: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  dateLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  quoteDate: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textPrimary,
  },

  amountContainer: {
    alignItems: 'flex-end',
  },

  amountLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  quoteAmount: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});