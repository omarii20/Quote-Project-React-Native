import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {Colors} from '../constants/colors';

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logos/quote-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.brandName}>Quote</Text>
      <Text style={styles.tagline}>הצעות מחיר בקליק</Text>
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
    color: Colors.textPrimary,
  },

  tagline: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});