import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

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
  const {colors} = useTheme();

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

  const getOptionStyle = (
    type: DiscountType,
  ) => ({
    borderColor:
      discountType === type
        ? colors.primary
        : colors.border,
    backgroundColor:
      discountType === type
        ? colors.surfaceSecondary
        : colors.surface,
  });

  const getOptionTextColor = (
    type: DiscountType,
  ) =>
    discountType === type
      ? colors.primary
      : colors.textSecondary;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {color: colors.textPrimary},
        ]}>
        הנחה ומע״מ
      </Text>

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        הנחה
      </Text>

      <View style={styles.discountRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle('none'),
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
              {
                color:
                  getOptionTextColor(
                    'none',
                  ),
              },
              discountType === 'none' &&
                styles.optionTextSelected,
            ]}>
            ללא
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle('percent'),
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
              {
                color:
                  getOptionTextColor(
                    'percent',
                  ),
              },
              discountType === 'percent' &&
                styles.optionTextSelected,
            ]}>
            %
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            getOptionStyle('fixed'),
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
              {
                color:
                  getOptionTextColor(
                    'fixed',
                  ),
              },
              discountType === 'fixed' &&
                styles.optionTextSelected,
            ]}>
            ₪
          </Text>
        </TouchableOpacity>
      </View>

      {discountType !== 'none' && (
        <>
          <Text
            style={[
              styles.label,
              {color: colors.textPrimary},
            ]}>
            {discountType === 'percent'
              ? 'אחוז הנחה'
              : 'סכום הנחה'}
          </Text>

          <View
            style={[
              styles.priceInputContainer,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}>
            <Text
              style={[
                styles.inputSuffix,
                {color: colors.textSecondary},
              ]}>
              {discountType === 'percent'
                ? '%'
                : '₪'}
            </Text>

            <TextInput
              style={[
                styles.priceInput,
                {color: colors.textPrimary},
              ]}
              value={discountValue}
              onChangeText={
                onChangeDiscountValue
              }
              placeholder="0"
              placeholderTextColor={
                colors.textSecondary
              }
              keyboardType="decimal-pad"
              textAlign="right"
            />
          </View>
        </>
      )}

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        מע״מ
      </Text>

      <View
        style={[
          styles.priceInputContainer,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}>
        <Text
          style={[
            styles.inputSuffix,
            {color: colors.textSecondary},
          ]}>
          %
        </Text>

        <TextInput
          style={[
            styles.priceInput,
            {color: colors.textPrimary},
          ]}
          value={vatRate}
          onChangeText={
            onChangeVatRate
          }
          placeholder="18"
          placeholderTextColor={
            colors.textSecondary
          }
          keyboardType="decimal-pad"
          textAlign="right"
        />
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}>
        <Text
          style={[
            styles.summaryTitle,
            {color: colors.textPrimary},
          ]}>
          סיכום
        </Text>

        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.summaryLabel,
              {color: colors.textSecondary},
            ]}>
            סכום ביניים
          </Text>

          <Text
            style={[
              styles.summaryValue,
              {color: colors.textPrimary},
            ]}>
            ₪{subtotal.toFixed(2)}
          </Text>
        </View>

        {discountType !== 'none' &&
          discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text
                style={[
                  styles.summaryLabel,
                  {color: colors.textSecondary},
                ]}>
                הנחה
              </Text>

              <Text
                style={[
                  styles.summaryValue,
                  {color: colors.textPrimary},
                ]}>
                -₪{discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.summaryLabel,
              {color: colors.textSecondary},
            ]}>
            מע״מ
            {vatNumber > 0
              ? ` (${vatNumber}%)`
              : ''}
          </Text>

          <Text
            style={[
              styles.summaryValue,
              {color: colors.textPrimary},
            ]}>
            ₪{vatAmount.toFixed(2)}
          </Text>
        </View>

        <View
          style={[
            styles.divider,
            {backgroundColor: colors.border},
          ]}
        />

        <View style={styles.totalRow}>
          <Text
            style={[
              styles.totalLabel,
              {color: colors.textPrimary},
            ]}>
            סה״כ
          </Text>

          <Text
            style={[
              styles.totalValue,
              {color: colors.primary},
            ]}>
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
    textAlign: 'right',
  },

  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },

  optionTextSelected: {
    fontWeight: '700',
  },

  priceInputContainer: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  priceInput: {
    flex: 1,
    fontSize: 16,
  },

  inputSuffix: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  summaryCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },

  summaryTitle: {
    marginBottom: 14,
    fontSize: 17,
    fontWeight: '700',
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
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    marginVertical: 6,
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
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '800',
  },
});