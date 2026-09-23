import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';

export type DiscountType =
  | 'none'
  | 'percent'
  | 'fixed';

type Props = {
  subtotal: number;

  discountType: DiscountType;
  discountValue: string;

  onChangeDiscountType: (
    value: DiscountType,
  ) => void;

  onChangeDiscountValue: (
    value: string,
  ) => void;

  vatRate: string;

  onChangeVatRate: (
    value: string,
  ) => void;
};

export default function QuoteTotalsForm({
  subtotal,
  discountType,
  discountValue,
  onChangeDiscountType,
  onChangeDiscountValue,
  vatRate,
  onChangeVatRate,
}: Props) {
  const discountNumber =
    Number(discountValue) || 0;

  const vatNumber =
    Number(vatRate) || 0;

  let discountAmount = 0;

  if (discountType === 'percent') {
    discountAmount =
      subtotal *
      (discountNumber / 100);
  }

  if (discountType === 'fixed') {
    discountAmount =
      discountNumber;
  }

  // Preview protection only.
  // Backend still performs the real validation.
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  const afterDiscount =
    subtotal - discountAmount;

  const vatAmount =
    afterDiscount *
    (vatNumber / 100);

  const total =
    afterDiscount + vatAmount;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        הנחה ומע״מ
      </Text>

      <Text style={styles.label}>
        הנחה
      </Text>

      <View style={styles.discountRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            discountType === 'none' &&
              styles.optionButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            onChangeDiscountType(
              'none',
            )
          }>
          <Text
            style={[
              styles.optionText,
              discountType === 'none' &&
                styles.optionTextSelected,
            ]}>
            ללא
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            discountType === 'percent' &&
              styles.optionButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            onChangeDiscountType(
              'percent',
            )
          }>
          <Text
            style={[
              styles.optionText,
              discountType === 'percent' &&
                styles.optionTextSelected,
            ]}>
            %
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            discountType === 'fixed' &&
              styles.optionButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            onChangeDiscountType(
              'fixed',
            )
          }>
          <Text
            style={[
              styles.optionText,
              discountType === 'fixed' &&
                styles.optionTextSelected,
            ]}>
            ₪
          </Text>
        </TouchableOpacity>
      </View>

      {discountType !== 'none' && (
        <>
          <Text style={styles.label}>
            {discountType === 'percent'
              ? 'אחוז הנחה'
              : 'סכום הנחה'}
          </Text>

          <View style={styles.priceInputContainer}>
            <Text style={styles.inputSuffix}>
              {discountType === 'percent'
                ? '%'
                : '₪'}
            </Text>

            <TextInput
              style={styles.priceInput}
              value={discountValue}
              onChangeText={
                onChangeDiscountValue
              }
              placeholder="0"
              placeholderTextColor={
                Colors.textSecondary
              }
              keyboardType="decimal-pad"
              textAlign="right"
            />
          </View>
        </>
      )}

      <Text style={styles.label}>
        מע״מ
      </Text>

      <View style={styles.priceInputContainer}>
        <Text style={styles.inputSuffix}>
          %
        </Text>

        <TextInput
          style={styles.priceInput}
          value={vatRate}
          onChangeText={
            onChangeVatRate
          }
          placeholder="18"
          placeholderTextColor={
            Colors.textSecondary
          }
          keyboardType="decimal-pad"
          textAlign="right"
        />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          סיכום
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            סכום ביניים
          </Text>

          <Text style={styles.summaryValue}>
            ₪{subtotal.toFixed(2)}
          </Text>
        </View>

        {discountType !== 'none' &&
          discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                הנחה
              </Text>

              <Text style={styles.summaryValue}>
                -₪
                {discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            מע״מ
            {vatNumber > 0
              ? ` (${vatNumber}%)`
              : ''}
          </Text>

          <Text style={styles.summaryValue}>
            ₪{vatAmount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            סה״כ
          </Text>

          <Text style={styles.totalValue}>
            ₪{total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  sectionTitle: {
    marginBottom: 14,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  discountRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },

  optionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF2FF',
  },

  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },

  priceInputContainer: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  priceInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },

  inputSuffix: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  summaryCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  summaryTitle: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  summaryRow: {
    marginBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  divider: {
    height: 1,
    marginVertical: 6,
    backgroundColor: Colors.border,
  },

  totalRow: {
    marginTop: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
});