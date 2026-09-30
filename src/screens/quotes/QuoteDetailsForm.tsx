import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

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
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {color: colors.textPrimary},
        ]}>
        פרטי ההצעה
      </Text>

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        כותרת
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.textPrimary,
          },
        ]}
        value={title}
        onChangeText={onChangeTitle}
        placeholder="לדוגמה: פיתוח אתר אינטרנט"
        placeholderTextColor={
          colors.textSecondary
        }
        textAlign="right"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        תיאור
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.textPrimary,
          },
        ]}
        value={description}
        onChangeText={
          onChangeDescription
        }
        placeholder="תיאור ההצעה"
        placeholderTextColor={
          colors.textSecondary
        }
        multiline
        textAlign="right"
        textAlignVertical="top"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        שיטת תמחור
      </Text>

      <View style={styles.pricingRow}>
        <TouchableOpacity
          style={[
            styles.pricingButton,
            {
              borderColor:
                pricingMethod === 'items'
                  ? colors.primary
                  : colors.border,
              backgroundColor:
                pricingMethod === 'items'
                  ? colors.surfaceSecondary
                  : colors.surface,
            },
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
              {
                color:
                  pricingMethod === 'items'
                    ? colors.primary
                    : colors.textSecondary,
              },
              pricingMethod === 'items' &&
                styles.pricingButtonTextSelected,
            ]}>
            לפי פריטים
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.pricingButton,
            {
              borderColor:
                pricingMethod === 'manual'
                  ? colors.primary
                  : colors.border,
              backgroundColor:
                pricingMethod === 'manual'
                  ? colors.surfaceSecondary
                  : colors.surface,
            },
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
              {
                color:
                  pricingMethod === 'manual'
                    ? colors.primary
                    : colors.textSecondary,
              },
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
    textAlign: 'right',
  },

  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  pricingButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  pricingButtonTextSelected: {
    fontWeight: '700',
  },
});