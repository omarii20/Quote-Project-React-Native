import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {MainStackParamList} from '../../../navigation/MainNavigator';

import {useTheme} from '../../../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function QuickActions() {
  const navigation = useNavigation<NavigationProp>();
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {color: colors.textPrimary},
        ]}>
        פעולות מהירות
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {backgroundColor: colors.primary},
          ]}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CreateQuote')
          }>
          <Text style={styles.primaryButtonText}>
            + הצעה חדשה
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CreateCustomer')
          }>
          <Text
            style={[
              styles.secondaryButtonText,
              {color: colors.primary},
            ]}>
            + לקוח חדש
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});