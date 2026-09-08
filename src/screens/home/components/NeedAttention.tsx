import React, {useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors} from '../../../constants/colors';
import {type Quote} from '../../../api/quotesApi';
import QuoteStatusBadge from '../../../components/ui/QuoteStatusBadge';

type Props = {
  quotes: Quote[];
};

type AttentionItem = {
  quote: Quote;
  message: string;
  priority: number;
};

export default function NeedAttention({
  quotes,
}: Props) {
  const attentionQuotes = useMemo(() => {
    const now = new Date();

    const items: AttentionItem[] = [];

    quotes.forEach(quote => {
      const status = quote.status?.toLowerCase();

      const createdAt = quote.created_at
        ? new Date(quote.created_at)
        : null;

      const validUntil = quote.valid_until
        ? new Date(quote.valid_until)
        : null;

      const daysSinceCreated = createdAt
        ? Math.floor(
            (now.getTime() - createdAt.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 0;

      const daysUntilExpiration = validUntil
        ? Math.ceil(
            (validUntil.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : null;

      if (
        status === 'expired' ||
        (validUntil &&
          validUntil.getTime() < now.getTime())
      ) {
        items.push({
          quote,
          message: 'תוקף ההצעה פג',
          priority: 1,
        });

        return;
      }

      if (
        daysUntilExpiration !== null &&
        daysUntilExpiration >= 0 &&
        daysUntilExpiration <= 2
      ) {
        items.push({
          quote,
          message:
            daysUntilExpiration === 0
              ? 'תוקף ההצעה מסתיים היום'
              : daysUntilExpiration === 1
                ? 'תוקף ההצעה מסתיים מחר'
                : 'תוקף ההצעה מסתיים בעוד יומיים',
          priority: 2,
        });

        return;
      }

      if (
        status === 'viewed' &&
        daysSinceCreated >= 2
      ) {
        items.push({
          quote,
          message:
            'הלקוח צפה בהצעה ועדיין לא אישר',
          priority: 3,
        });

        return;
      }

      if (
        status === 'sent' &&
        daysSinceCreated >= 5
      ) {
        items.push({
          quote,
          message: `ממתינה לתשובת הלקוח כבר ${daysSinceCreated} ימים`,
          priority: 4,
        });

        return;
      }

      if (
        status === 'draft' &&
        daysSinceCreated >= 3
      ) {
        items.push({
          quote,
          message: `טיוטה שלא נשלחה כבר ${daysSinceCreated} ימים`,
          priority: 5,
        });
      }
    });

    return items
      .sort(
        (a, b) =>
          a.priority - b.priority,
      )
      .slice(0, 3);
  }, [quotes]);

  if (attentionQuotes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        דורש טיפול
      </Text>

      {attentionQuotes.map(item => (
        <View
          key={item.quote.id}
          style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.quoteNumber}>
              {item.quote.quote_number}
            </Text>

            <QuoteStatusBadge
              status={item.quote.status}
            />
          </View>

          <Text style={styles.title}>
            {item.quote.title ||
              'הצעת מחיר ללא כותרת'}
          </Text>

          <Text style={styles.message}>
            {item.message}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  sectionTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  card: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quoteNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.danger,
    textAlign: 'right',
  },
});