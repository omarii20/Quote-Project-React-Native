import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

import {useAuth} from '../context/AuthContext';
import {Colors} from '../constants/colors';

export default function RootNavigator() {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});