import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/AuthNavigator';
import AppLogo from '../../components/ui/AppLogo';
import {Colors} from '../../constants/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {  const [phone, setPhone] = useState('');

  const isValidPhone = /^05\d{8}$/.test(phone);

  const handleSendOTP = () => {
    if (!isValidPhone) {
      return;
    }

    navigation.navigate('OTP', {
      phone,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <AppLogo />

          <View style={styles.header}>
            <Text style={styles.title}>ברוכים הבאים!</Text>
            <Text style={styles.subtitle}>התחברו כדי להמשיך</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>מספר טלפון</Text>

            <TextInput
              value={phone}
              onChangeText={text => {
                const numbersOnly = text.replace(/\D/g, '');
                setPhone(numbersOnly);
              }}
              placeholder="05X-XXXXXXX"
              placeholderTextColor="#A3A7B3"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
              textAlign="left"
            />

            <TouchableOpacity
              style={[
                styles.button,
                !isValidPhone && styles.buttonDisabled,
              ]}
              disabled={!isValidPhone}
              activeOpacity={0.85}
              onPress={handleSendOTP}>
              <Text style={styles.buttonText}>שלח קוד אימות</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            בהמשך תקבלו קוד אימות (OTP)
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },

  header: {
    marginTop: 28,
    alignItems: 'center',
  },

  title: {
    fontSize: 31,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    marginTop: 34,
    padding: 18,
    borderRadius: 22,
    backgroundColor: Colors.surface,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: '#FFFFFF',
  },

  button: {
    height: 56,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  helperText: {
    marginTop: 22,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});