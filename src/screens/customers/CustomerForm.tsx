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
} from '../../api/customersApi';

type Props = {
  onSubmit: (
    data: CreateCustomerData,
  ) => Promise<void>;

  loading?: boolean;
};

export default function CustomerForm({
  onSubmit,
  loading = false,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

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
            שמור לקוח
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