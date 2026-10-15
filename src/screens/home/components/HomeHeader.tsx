import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTheme} from '../../../context/ThemeContext';
import {useBusiness} from '../../../context/BusinessContext';

export default function HomeHeader() {
  const {colors} = useTheme();
  const {business, loading} = useBusiness();

  const hour = new Date().getHours();

  let greeting = 'שלום';

  if (hour < 12) {
    greeting = 'בוקר טוב';
  } else if (hour < 18) {
    greeting = 'צהריים טובים';
  } else {
    greeting = 'ערב טוב';
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.greeting,
          {color: colors.textPrimary},
        ]}>
        {greeting} 👋
      </Text>

      <Text
        style={[
          styles.businessName,
          {color: colors.textSecondary},
        ]}>
        {loading
          ? 'טוען פרטי עסק...'
          : business?.business_name ?? 'העסק שלי'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'flex-end',
  },

  greeting: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
  },

  businessName: {
    marginTop: 6,
    fontSize: 15,
    textAlign: 'right',
  },
});