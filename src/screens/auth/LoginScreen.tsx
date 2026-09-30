import React, {useState} from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/AuthNavigator';

import AppLogo from '../../components/AppLogo';

import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
  const {colors} = useTheme();

  const [phone, setPhone] = useState('');
  const {sendOTP} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidPhone = /^05\d{8}$/.test(phone);

  const handleSendOTP = async () => {
    if (!isValidPhone || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await sendOTP(phone);

      navigation.navigate('OTP', {
        phone,
      });
    } catch (err) {
      console.log('Login send OTP error:', err);

      setError('לא הצלחנו להתחיל את תהליך האימות. נסו שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: colors.background},
      ]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <AppLogo />

          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {color: colors.textPrimary},
              ]}>
              ברוכים הבאים!
            </Text>

            <Text
              style={[
                styles.subtitle,
                {color: colors.textSecondary},
              ]}>
              התחברו כדי להמשיך
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {backgroundColor: colors.surface},
            ]}>
            <Text
              style={[
                styles.label,
                {color: colors.textPrimary},
              ]}>
              מספר טלפון
            </Text>

            <TextInput
              value={phone}
              onChangeText={text => {
                const numbersOnly = text.replace(/\D/g, '');
                setPhone(numbersOnly);
              }}
              placeholder="05X-XXXXXXX"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                },
              ]}
              textAlign="left"
            />

            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: colors.primary},
                (!isValidPhone || isLoading) &&
                  styles.buttonDisabled,
              ]}
              disabled={!isValidPhone || isLoading}
              activeOpacity={0.85}
              onPress={handleSendOTP}>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.buttonText}>
                  שלח קוד אימות
                </Text>
              )}
            </TouchableOpacity>

            {!!error && (
              <Text
                style={[
                  styles.errorText,
                  {color: colors.danger},
                ]}>
                {error}
              </Text>
            )}
          </View>

          <Text
            style={[
              styles.helperText,
              {color: colors.textSecondary},
            ]}>
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
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 17,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    marginTop: 34,
    padding: 18,
    borderRadius: 22,

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
    textAlign: 'right',
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },

  button: {
    height: 56,
    marginTop: 16,
    borderRadius: 12,
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
    textAlign: 'center',
  },

  errorText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});