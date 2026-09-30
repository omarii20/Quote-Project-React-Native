import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../../context/ThemeContext';

export default function BackButton() {
  const navigation = useNavigation();
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => navigation.goBack()}>
      <Text
        style={[
          styles.icon,
          {color: colors.textPrimary},
        ]}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 30,
    lineHeight: 32,
  },
});