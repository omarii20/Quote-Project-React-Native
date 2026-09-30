import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

export type QuoteItemFormData = {
  description: string;
  quantity: string;
  unitPrice: string;
};

type Props = {
  pricingMethod: 'items' | 'manual';

  items: QuoteItemFormData[];

  onChangeItems: (
    items: QuoteItemFormData[],
  ) => void;

  additionalAmount: string;

  onChangeAdditionalAmount: (
    value: string,
  ) => void;

  manualSubtotal: string;

  onChangeManualSubtotal: (
    value: string,
  ) => void;
};

export default function QuotePricingForm({
  pricingMethod,
  items,
  onChangeItems,
  additionalAmount,
  onChangeAdditionalAmount,
  manualSubtotal,
  onChangeManualSubtotal,
}: Props) {
  const {colors} = useTheme();

  const updateItem = (
    index: number,
    field: keyof QuoteItemFormData,
    value: string,
  ) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    onChangeItems(updatedItems);
  };

  const addItem = () => {
    onChangeItems([
      ...items,
      {
        description: '',
        quantity: '1',
        unitPrice: '',
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChangeItems(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    );
  };

  const getItemTotal = (
    item: QuoteItemFormData,
  ) => {
    const quantity =
      Number(item.quantity) || 0;

    const unitPrice =
      Number(item.unitPrice) || 0;

    return quantity * unitPrice;
  };

  if (pricingMethod === 'manual') {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.sectionTitle,
            {color: colors.textPrimary},
          ]}>
          מחיר ההצעה
        </Text>

        <Text
          style={[
            styles.label,
            {color: colors.textPrimary},
          ]}>
          סכום ידני *
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
              styles.currency,
              {color: colors.textSecondary},
            ]}>
            ₪
          </Text>

          <TextInput
            style={[
              styles.priceInput,
              {color: colors.textPrimary},
            ]}
            value={manualSubtotal}
            onChangeText={
              onChangeManualSubtotal
            }
            placeholder="0"
            placeholderTextColor={
              colors.textSecondary
            }
            keyboardType="decimal-pad"
            textAlign="right"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {color: colors.textPrimary},
        ]}>
        פריטים
      </Text>

      {items.map((item, index) => {
        const total =
          getItemTotal(item);

        return (
          <View
            key={index}
            style={[
              styles.itemCard,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}>
            <View style={styles.itemHeader}>
              <Text
                style={[
                  styles.itemTitle,
                  {color: colors.textPrimary},
                ]}>
                פריט {index + 1}
              </Text>

              {items.length > 1 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    removeItem(index)
                  }>
                  <Text
                    style={[
                      styles.removeText,
                      {color: colors.danger},
                    ]}>
                    הסר
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={[
                styles.label,
                {color: colors.textPrimary},
              ]}>
              תיאור *
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                },
              ]}
              value={item.description}
              onChangeText={value =>
                updateItem(
                  index,
                  'description',
                  value,
                )
              }
              placeholder="תיאור הפריט"
              placeholderTextColor={
                colors.textSecondary
              }
              textAlign="right"
            />

            <View style={styles.priceRow}>
              <View style={styles.priceField}>
                <Text
                  style={[
                    styles.label,
                    {color: colors.textPrimary},
                  ]}>
                  כמות
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.textPrimary,
                    },
                  ]}
                  value={item.quantity}
                  onChangeText={value =>
                    updateItem(
                      index,
                      'quantity',
                      value,
                    )
                  }
                  keyboardType="decimal-pad"
                  placeholder="1"
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  textAlign="right"
                />
              </View>

              <View style={styles.priceField}>
                <Text
                  style={[
                    styles.label,
                    {color: colors.textPrimary},
                  ]}>
                  מחיר ליחידה
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                      color: colors.textPrimary,
                    },
                  ]}
                  value={item.unitPrice}
                  onChangeText={value =>
                    updateItem(
                      index,
                      'unitPrice',
                      value,
                    )
                  }
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  textAlign="right"
                />
              </View>
            </View>

            <View
              style={[
                styles.itemTotalRow,
                {borderTopColor: colors.border},
              ]}>
              <Text
                style={[
                  styles.totalLabel,
                  {color: colors.textSecondary},
                ]}>
                סה״כ פריט
              </Text>

              <Text
                style={[
                  styles.totalValue,
                  {color: colors.textPrimary},
                ]}>
                ₪{total.toFixed(2)}
              </Text>
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={[
          styles.addItemButton,
          {borderColor: colors.primary},
        ]}
        activeOpacity={0.8}
        onPress={addItem}>
        <Text
          style={[
            styles.addItemText,
            {color: colors.primary},
          ]}>
          + הוסף פריט
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        סכום נוסף
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
            styles.currency,
            {color: colors.textSecondary},
          ]}>
          ₪
        </Text>

        <TextInput
          style={[
            styles.priceInput,
            {color: colors.textPrimary},
          ]}
          value={additionalAmount}
          onChangeText={
            onChangeAdditionalAmount
          }
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={
            colors.textSecondary
          }
          textAlign="right"
        />
      </View>

      <Text
        style={[
          styles.helperText,
          {color: colors.textSecondary},
        ]}>
        סכום נוסף יתווסף לסכום הפריטים
      </Text>
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

  itemCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  itemHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  removeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  label: {
    marginTop: 12,
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
  },

  priceRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },

  priceField: {
    flex: 1,
  },

  itemTotalRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 14,
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '700',
  },

  addItemButton: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  addItemText: {
    fontSize: 15,
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

  currency: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'right',
  },
});