import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quotes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FC',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10162F',
  },
});