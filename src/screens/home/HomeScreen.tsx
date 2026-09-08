import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';
import {useQuotes} from '../../context/QuotesContext';

import HomeHeader from './components/HomeHeader';
import QuickActions from './components/QuickActions';
import RecentQuotes from './components/RecentQuotes';
import NeedAttention from './components/NeedAttention';

export default function HomeScreen() {
  const {
    quotes,
    loading,
    error,
  } = useQuotes();

  const recentQuotes = useMemo(() => {
    return quotes.slice(0, 3);
  }, [quotes]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <HomeHeader />

        <QuickActions />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text style={styles.loadingText}>
              טוען נתונים...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
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
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
  },

  errorContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'right',
  },
});