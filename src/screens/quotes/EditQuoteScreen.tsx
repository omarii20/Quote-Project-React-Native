import React, {
  useEffect,
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

import {Colors} from '../../constants/colors';

import BackButton from '../../components/ui/BackButton';

import QuoteDetailsForm, {
  type PricingMethod,
} from './QuoteDetailsForm';

import QuotePricingForm, {
  type QuoteItemFormData,
} from './QuotePricingForm';

import QuoteTotalsForm, {
  type DiscountType,
} from './QuoteTotalsForm';

import QuoteMetaForm from './QuoteMetaForm';

import {
  getQuoteById,
  updateQuote as updateQuoteApi,
  type Quote,
  type UpdateQuoteData,
} from '../../api/quotesApi';

import {useQuotes} from '../../context/QuotesContext';

import {validateQuote} from '../../validation/quoteValidation';

type EditQuoteRouteProp =
  RouteProp<
    MainStackParamList,
    'EditQuote'
  >;

type EditQuoteNavigationProp =
  NativeStackNavigationProp<
    MainStackParamList,
    'EditQuote'
  >;

export default function EditQuoteScreen() {
  const route = useRoute<EditQuoteRouteProp>();
  const navigation = useNavigation<EditQuoteNavigationProp>();

  const {quoteId} = route.params;

  const {updateQuote} = useQuotes();

  const [quote, setQuote] = useState<Quote | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [customerName, setCustomerName] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [pricingMethod, setPricingMethod] =
    useState<PricingMethod>('items');

  const [items, setItems] =
    useState<QuoteItemFormData[]>([]);

  const [additionalAmount, setAdditionalAmount] = useState('');
  const [manualSubtotal, setManualSubtotal] = useState('');

  const [discountType, setDiscountType] =
    useState<DiscountType>('none');

  const [discountValue, setDiscountValue] = useState('');
  const [vatRate, setVatRate] = useState('18');

  const [validUntil, setValidUntil] =
    useState<Date | null>(null);

  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const data = await getQuoteById(quoteId);

        setQuote(data);

        setCustomerName(
          data.customer?.name ?? '',
        );

        setTitle(
          data.title ?? '',
        );

        setDescription(
          data.description ?? '',
        );

        setPricingMethod(
          data.pricing_method,
        );

        setAdditionalAmount(
          String(
            data.additional_amount ?? '',
          ),
        );

        setManualSubtotal(
          data.manual_subtotal != null
            ? String(
                data.manual_subtotal,
              )
            : '',
        );

        setDiscountType(
          data.discount_type ?? 'none',
        );

        setDiscountValue(
          String(
            data.discount_value ?? '',
          ),
        );

        setVatRate(
          String(
            data.vat_rate ?? '18',
          ),
        );

        setValidUntil(
          data.valid_until
            ? new Date(
                data.valid_until,
              )
            : null,
        );

        setNotes(
          data.notes ?? '',
        );

        if (
          data.pricing_method ===
          'items'
        ) {
          setItems(
            (data.items ?? []).map(
              item => ({
                description:
                  item.description,

                quantity:
                  String(
                    item.quantity,
                  ),

                unitPrice:
                  String(
                    item.unit_price,
                  ),
              }),
            ),
          );
        } else {
          setItems([]);
        }
      } catch (error) {
        console.log(
          'Load quote for edit error:',
          error,
        );

        setLoadError(
          'לא הצלחנו לטעון את הצעת המחיר.',
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, [quoteId]);

  const itemsSubtotal = items.reduce(
    (sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;

      return sum + quantity * unitPrice;
    },
    0,
  );

  const subtotal =
    pricingMethod === 'items'
      ? itemsSubtotal +
        (Number(additionalAmount) || 0)
      : Number(manualSubtotal) || 0;

  const handleUpdateQuote = async () => {
    if (!quote || saving) {
      return;
    }

    setSaveError('');

    const validation = validateQuote({
        customerId: quote.customer_id,
        pricingMethod,
        items,
        additionalAmount,
        manualSubtotal,
        discountType,
        discountValue,
        vatRate,
    });

    if (!validation.isValid) {
        setSaveError(validation.error);
        return;
    }

    try {
      setSaving(true);

      let formattedValidUntil: string | null = null;

      if (validUntil) {
        const localDate = new Date(
          validUntil.getFullYear(),
          validUntil.getMonth(),
          validUntil.getDate(),
          12,
          0,
          0,
        );

        formattedValidUntil =
          localDate.toISOString();
      }

      const payload: UpdateQuoteData = {
        customer_id: quote.customer_id,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        pricing_method: pricingMethod,
        manual_subtotal: pricingMethod === 'manual' ? Number(manualSubtotal) : null,
        additional_amount: pricingMethod === 'items' ? Number(additionalAmount) || 0 : 0,
        discount_type: discountType === 'none' ? null : discountType,
        discount_value: discountType === 'none' ? 0 : Number(discountValue),
        vat_rate:Number(vatRate),
        valid_until: formattedValidUntil,
        notes:notes.trim() || undefined,
        items:
          pricingMethod === 'items'
            ? items.map(
                (item, index) => ({
                  description:
                    item.description.trim(),

                  quantity:
                    Number(
                      item.quantity,
                    ),

                  unit_price:
                    Number(
                      item.unitPrice,
                    ),

                  total_overridden:
                    false,

                  position:
                    index + 1,
                }),
              )
            : [],
      };

      const updatedQuote = await updateQuoteApi(
          quoteId,
          payload,
        );

      updateQuote(updatedQuote);

      navigation.goBack();
    } catch (error) {
      console.log(
        'Update quote error:',
        error,
      );

      setSaveError(
        'לא הצלחנו לעדכן את הצעת המחיר.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            טוען הצעת מחיר...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loadError || !quote) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />

          <Text style={styles.title}>
            עריכת הצעת מחיר
          </Text>
        </View>

        <Text style={styles.errorText}>
          {loadError ||
            'הצעת המחיר לא נמצאה.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <BackButton />

        <Text style={styles.title}>
          עריכת הצעת מחיר
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled">

        <View style={styles.customerCard}>
          <Text style={styles.customerLabel}>
            לקוח
          </Text>

          <Text style={styles.customerName}>
            {customerName ||
              'לקוח לא ידוע'}
          </Text>
        </View>

        <QuoteDetailsForm
          title={title}
          description={description}
          pricingMethod={
            pricingMethod
          }
          onChangeTitle={
            setTitle
          }
          onChangeDescription={
            setDescription
          }
          onChangePricingMethod={
            setPricingMethod
          }
        />

        <QuotePricingForm
          pricingMethod={
            pricingMethod
          }
          items={items}
          onChangeItems={
            setItems
          }
          additionalAmount={
            additionalAmount
          }
          onChangeAdditionalAmount={
            setAdditionalAmount
          }
          manualSubtotal={
            manualSubtotal
          }
          onChangeManualSubtotal={
            setManualSubtotal
          }
        />

        <QuoteTotalsForm
          subtotal={subtotal}
          discountType={
            discountType
          }
          discountValue={
            discountValue
          }
          onChangeDiscountType={
            setDiscountType
          }
          onChangeDiscountValue={
            setDiscountValue
          }
          vatRate={vatRate}
          onChangeVatRate={
            setVatRate
          }
        />

        <QuoteMetaForm
          validUntil={validUntil}
          notes={notes}
          onChangeValidUntil={
            setValidUntil
          }
          onChangeNotes={
            setNotes
          }
        />

        {saveError ? (
          <Text style={styles.saveErrorText}>
            {saveError}
          </Text>
        ) : null}

      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving &&
              styles.saveButtonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={saving}
          onPress={handleUpdateQuote}>

          {saving ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.saveButtonText}>
              שמירת שינויים
            </Text>
          )}

        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  errorText: {
    marginTop: 28,
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'right',
  },

  saveErrorText: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'right',
  },

  customerCard: {
    marginTop: 20,
    backgroundColor:
      Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'flex-end',
  },

  customerLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  customerName: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  bottomActions: {
    paddingTop: 12,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor:
      Colors.background,
  },

  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor:
      Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});