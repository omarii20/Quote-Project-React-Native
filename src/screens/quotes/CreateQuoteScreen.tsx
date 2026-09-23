import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';

import { useNavigation,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  MainStackParamList,
} from '../../navigation/MainNavigator';

import {Colors} from '../../constants/colors';
import {useQuotes} from '../../context/QuotesContext';
import BackButton from '../../components/ui/BackButton';
import CustomerSelector from '../customers/CustomerSelector';

import QuoteDetailsForm, {
  type PricingMethod,
} from '../quotes/QuoteDetailsForm';

import QuotePricingForm, {
  type QuoteItemFormData,
} from './QuotePricingForm';

import QuoteTotalsForm, {
  type DiscountType,
} from './QuoteTotalsForm';

import {
  createCustomer,
  getCustomers,
  type Customer,
  type CreateCustomerData,
} from '../../api/customersApi';

import QuoteMetaForm from './QuoteMetaForm';
import {validateQuote} from '../../validation/quoteValidation';

import {
  createQuote,
  type CreateQuoteData,
} from '../../api/quotesApi';

type CreateQuoteNavigationProp =NativeStackNavigationProp<MainStackParamList,'CreateQuote'>;

export default function CreateQuoteScreen() {
  const {addQuote} = useQuotes();
  const [savingQuote, setSavingQuote] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigation = useNavigation<CreateQuoteNavigationProp>();

  // Customers
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<Customer | null>(null);

  const [
    loadingCustomers,
    setLoadingCustomers,
  ] = useState(true);

  const [
    creatingCustomer,
    setCreatingCustomer,
  ] = useState(false);

  const [
    customersError,
    setCustomersError,
  ] = useState('');

  // Quote details
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    pricingMethod,
    setPricingMethod,
  ] = useState<PricingMethod>('items');

  // Items pricing
  const [
    items,
    setItems,
  ] = useState<QuoteItemFormData[]>([
    {
      description: '',
      quantity: '1',
      unitPrice: '',
    },
  ]);

  const [
    additionalAmount,
    setAdditionalAmount,
  ] = useState('');

  // Manual pricing
  const [
    manualSubtotal,
    setManualSubtotal,
  ] = useState('');

  // Discount
  const [
    discountType,
    setDiscountType,
  ] = useState<DiscountType>('none');

  const [
    discountValue,
    setDiscountValue,
  ] = useState('');

  // VAT
  const [
    vatRate,
    setVatRate,
  ] = useState('18');

  // Meta
  const [
    validUntil,
    setValidUntil,
  ] = useState<Date | null>(null);

  const [
    notes,
    setNotes,
  ] = useState('');

  const handleAddCustomer = async (data: CreateCustomerData,): Promise<Customer> => {
    try {
      setCreatingCustomer(true);

      const newCustomer =
        await createCustomer(data);

      setCustomers(currentCustomers => [
        newCustomer,
        ...currentCustomers,
      ]);

      return newCustomer;
    } finally {
      setCreatingCustomer(false);
    }
  };

  const handleCreateQuote = async () => {
    const validation = validateQuote({customerId:
        selectedCustomer?.id ?? null,
        pricingMethod,
        items,
        additionalAmount,
        manualSubtotal,
        discountType,
        discountValue,
        vatRate,
    });

    if (!validation.isValid) {
      setSubmitError(validation.error);
      return;
    }

    if (!selectedCustomer) {
      return;
    }

    try {
      setSavingQuote(true);
      setSubmitError('');

      const formattedValidUntil = validUntil? (() => {
              const date = new Date(validUntil);
              date.setHours(12, 0, 0, 0);
              return date.toISOString();
            })(): null;

      const payload: CreateQuoteData = {
        customer_id: selectedCustomer.id,
        title:title.trim() || undefined,
        description: description.trim() || undefined,
        pricing_method: pricingMethod,
        discount_type: discountType === 'none' ? null: discountType,
        discount_value: discountType === 'none' ? 0 : Number(discountValue),
        vat_rate: Number(vatRate),
        status: 'draft',
        valid_until: formattedValidUntil,
        notes: notes.trim() || undefined,
        ...(pricingMethod === 'items' ? {additional_amount: Number( additionalAmount, ) || 0,

              items: items.map(
                (item, index) => ({
                  description: item.description.trim(),
                  quantity: Number( item.quantity),
                  unit_price:Number(item.unitPrice),
                  total_overridden:false,
                  position: index + 1,
                }),
              ),
            }:{
              manual_subtotal: Number(manualSubtotal),
            }),
      };

      //console.log('Create quote payload:',payload,);
      const newQuote = await createQuote(payload);
      addQuote(newQuote);
      navigation.goBack();
      //console.log('Created quote:',newQuote);
    } catch (error) {
      console.log('Create quote error:', error,);
      setSubmitError('לא הצלחנו ליצור את הצעת המחיר.');
    } finally {
      setSavingQuote(false);
    }
  };

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        setCustomersError('');

        const data =
          await getCustomers();

        setCustomers(data);
      } catch (error) {
        console.log(
          'Load customers error:',
          error,
        );

        setCustomersError(
          'לא הצלחנו לטעון את הלקוחות.',
        );
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  // Preview calculation for items
  const itemsSubtotal =
    items.reduce(
      (sum, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const unitPrice =
          Number(item.unitPrice) || 0;

        return (
          sum +
          quantity * unitPrice
        );
      },
      0,
    );

  // Preview subtotal
  const subtotal =
    pricingMethod === 'items'
      ? itemsSubtotal +
        (Number(additionalAmount) || 0)
      : Number(manualSubtotal) || 0;

  return (
    <SafeAreaView style={styles.container}> 
      <View style={styles.header}>
        <BackButton />

        <Text style={styles.title}>
          יצירת הצעת מחיר חדשה
        </Text>
      </View>

      {loadingCustomers ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            טוען לקוחות...
          </Text>
        </View>
      ) : customersError ? (
        <Text style={styles.errorText}>
          {customersError}
        </Text>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <CustomerSelector
            customers={customers}
            selectedCustomer={
              selectedCustomer
            }
            onSelectCustomer={
              setSelectedCustomer
            }
            onAddCustomer={
              handleAddCustomer
            }
            creatingCustomer={
              creatingCustomer
            }
          />

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
            vatRate={
              vatRate
            }
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
            {submitError ? (
              <Text style={styles.submitError}>{submitError} </Text>
            ) : null}

          <TouchableOpacity
            style={[
              styles.saveButton,
              savingQuote &&
              styles.saveButtonDisabled,
            ]}
            onPress={handleCreateQuote}
            disabled={savingQuote}
            activeOpacity={0.8}>

            {savingQuote ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.saveButtonText}>
                שמור כטיוטה
              </Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
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
    paddingBottom: 40,
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
  submitError: {
  marginTop: 16,
  fontSize: 14,
  color: Colors.danger,
  textAlign: 'right',
},

saveButton: {
  height: 54,
  marginTop: 20,
  borderRadius: 14,
  backgroundColor: Colors.primary,
  alignItems: 'center',
  justifyContent: 'center',
},

saveButtonDisabled: {
  opacity: 0.6,
},

saveButtonText: {
  fontSize: 17,
  fontWeight: '700',
  color: '#FFFFFF',
},
});