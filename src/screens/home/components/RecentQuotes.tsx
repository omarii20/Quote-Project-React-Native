import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

import {Colors} from '../../../constants/colors';
import {type Quote} from '../../../api/quotesApi';
import type {MainTabParamList} from '../../../navigation/MainNavigator';
import QuoteStatusBadge from '../../../components/ui/QuoteStatusBadge';

type Props = {
  quotes: Quote[];
};

type NavigationProp =
  BottomTabNavigationProp<MainTabParamList>;

export default function RecentQuotes({
  quotes,
}: Props) {
  const navigation = useNavigation<NavigationProp>();

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
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          הצעות מחיר אחרונות
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Quotes')
          }
          activeOpacity={0.7}>
          <Text style={styles.seeAll}>
            הצג הכל
          </Text>
        </TouchableOpacity>
      </View>

      {quotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            אין הצעות מחיר עדיין
          </Text>

          <Text style={styles.emptySubtitle}>
            הצעות המחיר האחרונות שלך יופיעו כאן.
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
              <Text style={styles.quoteDate}>
                {formatDate(quote.created_at)}
              </Text>

              <Text style={styles.quoteAmount}>
                {formatAmount(
                  quote.total ??
                    quote.subtotal,
                )}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
    alignItems: 'center',
  },

  quoteDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  quoteAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
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
});