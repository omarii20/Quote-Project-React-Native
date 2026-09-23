import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';

export type PricingMethod =
  | 'items'
  | 'manual';

type Props = {
  title: string;
  description: string;
  pricingMethod: PricingMethod;

  onChangeTitle: (
    value: string,
  ) => void;

  onChangeDescription: (
    value: string,
  ) => void;

  onChangePricingMethod: (
    value: PricingMethod,
  ) => void;
};

export default function QuoteDetailsForm({
  title,
  description,
  pricingMethod,
  onChangeTitle,
  onChangeDescription,
  onChangePricingMethod,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        פרטי ההצעה
      </Text>

      <Text style={styles.label}>
        כותרת
      </Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={onChangeTitle}
        placeholder="לדוגמה: פיתוח אתר אינטרנט"
        placeholderTextColor={
          Colors.textSecondary
        }
        textAlign="right"
      />

      <Text style={styles.label}>
        תיאור
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        value={description}
        onChangeText={
          onChangeDescription
        }
        placeholder="תיאור ההצעה"
        placeholderTextColor={
          Colors.textSecondary
        }
        multiline
        textAlign="right"
        textAlignVertical="top"
      />

      <Text style={styles.label}>
        שיטת תמחור
      </Text>

      <View style={styles.pricingRow}>
        <TouchableOpacity
          style={[
            styles.pricingButton,
            pricingMethod === 'items' &&
              styles.pricingButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            onChangePricingMethod(
              'items',
            )
          }>
          <Text
            style={[
              styles.pricingButtonText,
              pricingMethod === 'items' &&
                styles.pricingButtonTextSelected,
            ]}>
            לפי פריטים
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pricingButton,
            pricingMethod === 'manual' &&
              styles.pricingButtonSelected,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            onChangePricingMethod(
              'manual',
            )
          }>
          <Text
            style={[
              styles.pricingButtonText,
              pricingMethod === 'manual' &&
                styles.pricingButtonTextSelected,
            ]}>
            מחיר ידני
          </Text>
        </TouchableOpacity>
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

  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    fontSize: 15,
  },

  descriptionInput: {
    minHeight: 110,
    paddingTop: 14,
  },

  pricingRow: {
    flexDirection: 'row-reverse',
    gap: 10,
  },

  pricingButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pricingButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF2FF',
  },

  pricingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  pricingButtonTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});