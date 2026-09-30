import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useQuotes} from '../../context/QuotesContext';
import {useTheme} from '../../context/ThemeContext';

import HomeHeader from './components/HomeHeader';
import QuickActions from './components/QuickActions';
import RecentQuotes from './components/RecentQuotes';
import NeedAttention from './components/NeedAttention';

export default function HomeScreen() {
  const {colors} = useTheme();
  const {
    quotes,
    loading,
    error,
  } = useQuotes();

  const recentQuotes = useMemo(() => {
    return quotes.slice(0, 3);
  }, [quotes]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <HomeHeader />

        <QuickActions />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text
              style={[
                styles.loadingText,
                {color: colors.textSecondary},
              ]}>
              טוען נתונים...
            </Text>
          </View>
        ) : error ? (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.errorText,
                {color: colors.danger},
              ]}>
              {error}
            </Text>
          </View>
        ) : (
          <>
            <NeedAttention quotes={quotes} />

            <RecentQuotes
              quotes={recentQuotes}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  errorContainer: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'right',
  },
});