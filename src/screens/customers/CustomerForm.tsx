import React, {useState} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

import type {
  CreateCustomerData,
  Customer,
} from '../../api/customersApi';

type Props = {
  onSubmit: (
    data: CreateCustomerData,
  ) => Promise<void>;

  loading?: boolean;
  initialValues?: Customer;
  submitLabel?: string;
};

export default function CustomerForm({
  onSubmit,
  loading = false,
  initialValues,
  submitLabel = 'שמור לקוח',
}: Props) {
  const {colors} = useTheme();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [phone, setPhone] = useState(initialValues?.phone ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [address, setAddress] = useState(initialValues?.address ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  const handleSubmit = async () => {
    const trimmedName = name.trim();

    if (!trimmedName || loading) {
      return;
    }

    await onSubmit({
      name: trimmedName,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        שם הלקוח *
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="שם הלקוח"
        placeholderTextColor={colors.textSecondary}
        textAlign="right"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        טלפון
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={phone}
        onChangeText={setPhone}
        placeholder="מספר טלפון"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        textAlign="right"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        אימייל
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign="right"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        כתובת
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={address}
        onChangeText={setAddress}
        placeholder="כתובת"
        placeholderTextColor={colors.textSecondary}
        textAlign="right"
      />

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        הערות
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.notesInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={notes}
        onChangeText={setNotes}
        placeholder="הערות על הלקוח"
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        textAlign="right"
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          {backgroundColor: colors.primary},
          (!name.trim() || loading) &&
            styles.disabledButton,
        ]}
        activeOpacity={0.8}
        disabled={!name.trim() || loading}
        onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator
            color="#FFFFFF"
          />
        ) : (
          <Text style={styles.submitText}>
            {submitLabel}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    marginBottom: 7,
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 15,
  },

  notesInput: {
    minHeight: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },

  submitButton: {
    minHeight: 52,
    marginTop: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});