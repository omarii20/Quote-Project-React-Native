import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';

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
        <Text style={styles.sectionTitle}>
          מחיר ההצעה
        </Text>

        <Text style={styles.label}>
          סכום ידני *
        </Text>

        <View style={styles.priceInputContainer}>
          <Text style={styles.currency}>
            ₪
          </Text>

          <TextInput
            style={styles.priceInput}
            value={manualSubtotal}
            onChangeText={
              onChangeManualSubtotal
            }
            placeholder="0"
            placeholderTextColor={
              Colors.textSecondary
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
      <Text style={styles.sectionTitle}>
        פריטים
      </Text>

      {items.map((item, index) => {
        const total =
          getItemTotal(item);

        return (
          <View
            key={index}
            style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                פריט {index + 1}
              </Text>

              {items.length > 1 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    removeItem(index)
                  }>
                  <Text
                    style={
                      styles.removeText
                    }>
                    הסר
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.label}>
              תיאור *
            </Text>

            <TextInput
              style={styles.input}
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
                Colors.textSecondary
              }
              textAlign="right"
            />

            <View style={styles.priceRow}>
              <View
                style={
                  styles.priceField
                }>
                <Text style={styles.label}>
                  כמות
                </Text>

                <TextInput
                  style={styles.input}
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
                    Colors.textSecondary
                  }
                  textAlign="right"
                />
              </View>

              <View
                style={
                  styles.priceField
                }>
                <Text style={styles.label}>
                  מחיר ליחידה
                </Text>

                <TextInput
                  style={styles.input}
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
                    Colors.textSecondary
                  }
                  textAlign="right"
                />
              </View>
            </View>

            <View style={styles.itemTotalRow}>
              <Text style={styles.totalLabel}>
                סה״כ פריט
              </Text>

              <Text style={styles.totalValue}>
                ₪{total.toFixed(2)}
              </Text>
            </View>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.addItemButton}
        activeOpacity={0.8}
        onPress={addItem}>
        <Text style={styles.addItemText}>
          + הוסף פריט
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>
        סכום נוסף
      </Text>

      <View style={styles.priceInputContainer}>
        <Text style={styles.currency}>
          ₪
        </Text>

        <TextInput
          style={styles.priceInput}
          value={additionalAmount}
          onChangeText={
            onChangeAdditionalAmount
          }
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={
            Colors.textSecondary
          }
          textAlign="right"
        />
      </View>

      <Text style={styles.helperText}>
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
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  itemCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
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
    color: Colors.textPrimary,
  },

  removeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },

  label: {
    marginTop: 12,
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
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
    borderTopColor: Colors.border,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  addItemButton: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  addItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
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

  currency: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});