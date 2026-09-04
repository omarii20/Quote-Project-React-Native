import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/AuthNavigator';
import {Colors} from '../../constants/colors';
import {useAuth} from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const OTP_LENGTH = 6;

export default function OTPScreen({navigation, route}: Props) {
  const {verifyOTP} = useAuth();
  const {phone} = route.params;
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(25);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleVerifyOtp = async (code: string) => {
    try {
      setIsVerifying(true);
      setError('');

      await verifyOTP(code);

      console.log('OTP verified successfully');
    } catch (err) {
      console.log('OTP verification error:', err);

      setError('קוד האימות שגוי. נסו שוב.');
      setOtp('');

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = async (text: string) => {
    if (isVerifying) {
      return;
    }

    const numbersOnly = text
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);

    setOtp(numbersOnly);
    setError('');

    if (numbersOnly.length === OTP_LENGTH) {
      await handleVerifyOtp(numbersOnly);
    }
  };

  const handleResend = () => {
    if (seconds > 0 || isVerifying) {
      return;
    }

    setSeconds(25);
    setOtp('');
    setError('');

    console.log('Resend OTP to:', phone);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const formatPhone = (value: string) => {
    if (value.length !== 10) {
      return value;
    }

    return `${value.slice(0, 3)}-${value.slice(3)}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          disabled={isVerifying}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>אימות מספר טלפון</Text>

          <Text style={styles.description}>
            שלחנו קוד אימות ל:
          </Text>

          <Text style={styles.phone}>
            {formatPhone(phone)}
          </Text>

          <TouchableOpacity
            disabled={isVerifying}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Text style={styles.changePhone}>
              שינוי מספר
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          disabled={isVerifying}
          style={styles.otpContainer}
          onPress={() => inputRef.current?.focus()}>
          {Array.from({length: OTP_LENGTH}).map((_, index) => {
            const digit = otp[index] ?? '';

            const isActive =
              !isVerifying &&
              index === otp.length &&
              otp.length < OTP_LENGTH;

            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  isActive && styles.otpBoxActive,
                  error !== '' && styles.otpBoxError,
                ]}>
                <Text style={styles.otpDigit}>
                  {digit}
                </Text>
              </View>
            );
          })}
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          editable={!isVerifying}
          caretHidden
          style={styles.hiddenInput}
        />

        {isVerifying && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={Colors.primary}
            />

            <Text style={styles.loadingText}>
              מאמת קוד...
            </Text>
          </View>
        )}

        {!!error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            לא קיבלת קוד?
          </Text>

          <TouchableOpacity
            disabled={seconds > 0 || isVerifying}
            activeOpacity={0.7}
            onPress={handleResend}>
            <Text
              style={[
                styles.resendAction,
                (seconds > 0 || isVerifying) &&
                  styles.resendDisabled,
              ]}>
              {seconds > 0
                ? `שלח שוב (${String(seconds).padStart(2, '0')})`
                : 'שלח שוב'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 38,
    color: Colors.textPrimary,
  },

  header: {
    marginTop: 32,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  description: {
    marginTop: 24,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  phone: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  changePhone: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 42,
  },

  otpBox: {
    width: 54,
    height: 58,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpBoxActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  otpBoxError: {
    borderColor: Colors.danger,
  },

  otpDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  loadingContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
    textAlign: 'center',
  },

  resendContainer: {
    marginTop: 28,
    alignItems: 'center',
  },

  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  resendAction: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },

  resendDisabled: {
    color: Colors.textSecondary,
  },
});