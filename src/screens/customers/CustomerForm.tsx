import React, {useState} from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';

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
      <Text style={styles.label}>
        שם הלקוח *
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="שם הלקוח"
        placeholderTextColor={
          Colors.textSecondary
        }
        textAlign="right"
      />

      <Text style={styles.label}>
        טלפון
      </Text>

      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="מספר טלפון"
        placeholderTextColor={
          Colors.textSecondary
        }
        keyboardType="phone-pad"
        textAlign="right"
      />

      <Text style={styles.label}>
        אימייל
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        placeholderTextColor={
          Colors.textSecondary
        }
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign="right"
      />

      <Text style={styles.label}>
        כתובת
      </Text>

      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="כתובת"
        placeholderTextColor={
          Colors.textSecondary
        }
        textAlign="right"
      />

      <Text style={styles.label}>
        הערות
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.notesInput,
        ]}
        value={notes}
        onChangeText={setNotes}
        placeholder="הערות על הלקוח"
        placeholderTextColor={
          Colors.textSecondary
        }
        multiline
        numberOfLines={4}
        textAlign="right"
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
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
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.primary,
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