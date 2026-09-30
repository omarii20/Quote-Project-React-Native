import React from 'react';

import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTheme} from '../context/ThemeContext';

export default function AppLogo() {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logos/quote-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.brandName,
          {color: colors.textPrimary},
        ]}>
        Quote
      </Text>

      <Text
        style={[
          styles.tagline,
          {color: colors.primary},
        ]}>
        הצעות מחיר בקליק
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  logo: {
    width: 105,
    height: 105,
  },

  brandName: {
    marginTop: 6,
    fontSize: 29,
    fontWeight: '800',
  },

  tagline: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
  },
});