import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  Alert,
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

import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

import {
  deleteQuote,
  getQuoteById,
  type Quote,
} from '../../api/quotesApi';

import {useQuotes} from '../../context/QuotesContext';
import {useTheme} from '../../context/ThemeContext';

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
  const {colors} = useTheme();

  const {quoteId} = route.params;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const {removeQuote} = useQuotes();

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

  const handleDeleteQuote = () => {
    if (!quote || deleting) {
      return;
    }

    Alert.alert(
      'מחיקת הצעת מחיר',
      `האם אתה בטוח שברצונך למחוק את ${quote.quote_number}?`,
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'מחיקה',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);

              await deleteQuote(quote.id);

              removeQuote(quote.id);

              navigation.goBack();
            } catch (err) {
              console.log('Delete quote error:', err);

              Alert.alert(
                'שגיאה',
                'לא הצלחנו למחוק את הצעת המחיר.',
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  const canEdit = quote?.status !== 'approved';

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: colors.background},
        ]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text
            style={[
              styles.loadingText,
              {color: colors.textSecondary},
            ]}>
            טוען פרטי הצעת מחיר...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !quote) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: colors.background},
        ]}>
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.errorText,
              {color: colors.danger},
            ]}>
            {error ||
              'הצעת המחיר לא נמצאה.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>

      <View style={styles.header}>
        <BackButton />

        <View style={styles.headerContent}>
          <View style={styles.quoteInfoRow}>
            <Text
              style={[
                styles.quoteNumber,
                {color: colors.textSecondary},
              ]}>
              {quote.quote_number}
            </Text>

            <QuoteStatusBadge
              status={quote.status}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.deleteIconButton,
            {backgroundColor: colors.surfaceSecondary},
          ]}
          activeOpacity={0.7}
          disabled={deleting}
          onPress={handleDeleteQuote}>
          {deleting ? (
            <ActivityIndicator
              size="small"
              color={colors.danger}
            />
          ) : (
            <MaterialDesignIcons
              name="delete-outline"
              size={24}
              color={colors.danger}
            />
          )}
        </TouchableOpacity>
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
          <Text
            style={[
              styles.title,
              {color: colors.textPrimary},
            ]}>
            {quote.title ||
              'הצעת מחיר ללא כותרת'}
          </Text>

          {quote.description ? (
            <Text
              style={[
                styles.description,
                {color: colors.textSecondary},
              ]}>
              {quote.description}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <Text
            style={[
              styles.cardTitle,
              {color: colors.textPrimary},
            ]}>
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
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: colors.textPrimary},
              ]}>
              פריטים
            </Text>

            {quote.items.map(
              (item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemContainer,
                    {
                      borderBottomColor: colors.border,
                    },
                  ]}>

                  <Text
                    style={[
                      styles.itemTitle,
                      {color: colors.textPrimary},
                    ]}>
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

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <Text
            style={[
              styles.cardTitle,
              {color: colors.textPrimary},
            ]}>
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
            style={[
              styles.totalDivider,
              {backgroundColor: colors.border},
            ]}
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
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: colors.textPrimary},
              ]}>
              הערות
            </Text>

            <Text
              style={[
                styles.notesText,
                {color: colors.textSecondary},
              ]}>
              {quote.notes}
            </Text>
          </View>
        ) : null}

      </ScrollView>

      {canEdit ? (
        <View
          style={[
            styles.bottomActions,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.editButton,
              {backgroundColor: colors.primary},
            ]}
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
  const {colors} = useTheme();

  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          {
            color: strong
              ? colors.textPrimary
              : colors.textSecondary,
          },
          strong && styles.strongText,
        ]}>
        {label}
      </Text>

      <Text
        style={[
          styles.detailValue,
          {
            color: strong
              ? colors.primary
              : colors.textPrimary,
          },
          strong && styles.totalValue,
        ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: 'right',
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
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
  },

  errorText: {
    fontSize: 15,
    textAlign: 'center',
  },

  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },

  cardTitle: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: '700',
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
    textAlign: 'right',
  },

  detailValue: {
    fontSize: 14,
    textAlign: 'left',
  },

  strongText: {
    fontWeight: '700',
  },

  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },

  totalDivider: {
    height: 1,
    marginVertical: 10,
  },

  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  itemTitle: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },

  notesText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
  },

  bottomActions: {
    paddingTop: 12,
    paddingBottom: 6,
    borderTopWidth: 1,
  },

  editButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});