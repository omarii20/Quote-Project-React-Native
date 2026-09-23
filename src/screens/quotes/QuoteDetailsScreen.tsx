import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import type {
  RouteProp,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  MainStackParamList,
} from '../../navigation/MainNavigator';

import {
  getQuoteById,
  type Quote,
} from '../../api/quotesApi';

import {Colors} from '../../constants/colors';

import QuoteStatusBadge from '../../components/ui/QuoteStatusBadge';
import BackButton from '../../components/ui/BackButton';

type QuoteDetailsRouteProp =
  RouteProp<
    MainStackParamList,
    'QuoteDetails'
  >;

type QuoteDetailsNavigationProp =
  NativeStackNavigationProp<
    MainStackParamList,
    'QuoteDetails'
  >;

export default function QuoteDetailsScreen() {
  const route = useRoute<QuoteDetailsRouteProp>();
  const navigation = useNavigation<QuoteDetailsNavigationProp>();

  const {quoteId} = route.params;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadQuote = async () => {
        try {
          setLoading(true);
          setError('');

          const data = await getQuoteById(quoteId);

          setQuote(data);
        } catch (err) {
          console.log(
            'Load quote details error:',
            err,
          );

          setError(
            'לא הצלחנו לטעון את פרטי הצעת המחיר.',
          );
        } finally {
          setLoading(false);
        }
      };

      loadQuote();
    }, [quoteId]),
  );

  const formatAmount = (value?: number | string | null,) => {
    const amount = Number(value ?? 0);

    if (Number.isNaN(amount)) {
      return '₪0';
    }

    return `₪${amount.toLocaleString(
      'he-IL',
    )}`;
  };

  const formatDate = (date?: string | null,) => {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      'he-IL',
    );
  };

  const canEdit = quote?.status !== 'approved';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            טוען פרטי הצעת מחיר...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !quote) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            {error ||
              'הצעת המחיר לא נמצאה.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <BackButton />

        <View style={styles.headerContent}>
          <View style={styles.quoteInfoRow}>
            <Text style={styles.quoteNumber}>
              {quote.quote_number}
            </Text>

            <QuoteStatusBadge
              status={quote.status}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }>

        <View style={styles.quoteHeading}>
          <Text style={styles.title}>
            {quote.title ||
              'הצעת מחיר ללא כותרת'}
          </Text>

          {quote.description ? (
            <Text style={styles.description}>
              {quote.description}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            פרטי הצעה
          </Text>

          <DetailRow
            label="לקוח"
            value={
              quote.customer?.name ??
              String(quote.customer_id)
            }
          />

          <DetailRow
            label="שיטת תמחור"
            value={
              quote.pricing_method ===
              'items'
                ? 'לפי פריטים'
                : 'סכום ידני'
            }
          />

          <DetailRow
            label="תאריך יצירה"
            value={formatDate(
              quote.created_at,
            )}
          />

          <DetailRow
            label="תוקף עד"
            value={formatDate(
              quote.valid_until,
            )}
          />
        </View>

        {quote.pricing_method ===
          'items' &&
        quote.items &&
        quote.items.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              פריטים
            </Text>

            {quote.items.map(
              (item, index) => (
                <View
                  key={item.id}
                  style={
                    styles.itemContainer
                  }>

                  <Text
                    style={
                      styles.itemTitle
                    }>
                    {index + 1}.{' '}
                    {item.description}
                  </Text>

                  <DetailRow
                    label="כמות"
                    value={String(
                      item.quantity,
                    )}
                  />

                  <DetailRow
                    label="מחיר יחידה"
                    value={formatAmount(
                      item.unit_price,
                    )}
                  />

                  <DetailRow
                    label="סה״כ"
                    value={formatAmount(
                      item.total,
                    )}
                  />
                </View>
              ),
            )}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            סיכום כספי
          </Text>

          {quote.pricing_method ===
          'items' ? (
            <>
              <DetailRow
                label="סה״כ פריטים"
                value={formatAmount(
                  quote.items_subtotal,
                )}
              />

              <DetailRow
                label="תוספת"
                value={formatAmount(
                  quote.additional_amount,
                )}
              />
            </>
          ) : (
            <DetailRow
              label="סכום ידני"
              value={formatAmount(
                quote.manual_subtotal,
              )}
            />
          )}

          <DetailRow
            label="סכום ביניים"
            value={formatAmount(
              quote.subtotal,
            )}
          />

          <DetailRow
            label="הנחה"
            value={formatAmount(
              quote.discount_amount,
            )}
          />

          <DetailRow
            label={`מע״מ ${quote.vat_rate}%`}
            value={formatAmount(
              quote.vat_amount,
            )}
          />

          <View
            style={
              styles.totalDivider
            }
          />

          <DetailRow
            label="סה״כ"
            value={formatAmount(
              quote.total,
            )}
            strong
          />
        </View>

        {quote.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              הערות
            </Text>

            <Text style={styles.notesText}>
              {quote.notes}
            </Text>
          </View>
        ) : null}

      </ScrollView>

      {canEdit ? (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                'EditQuote',
                {
                  quoteId: quote.id,
                },
              )
            }>
            <Text style={styles.editButtonText}>
              עריכת הצעת מחיר
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

    </SafeAreaView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

function DetailRow({
  label,
  value,
  strong = false,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          strong &&
            styles.strongText,
        ]}>
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          strong &&
            styles.totalValue,
        ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  headerContent: {
    flex: 1,
  },

  quoteInfoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },

  quoteNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  quoteHeading: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },

  errorText: {
    fontSize: 15,
    color: Colors.danger,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },

  cardTitle: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  detailValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'left',
  },

  strongText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },

  totalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },

  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  itemTitle: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  notesText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  bottomActions: {
    paddingTop: 12,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },

  editButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});