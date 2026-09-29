import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';

import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {MainStackParamList} from '../../navigation/MainNavigator';

import {useCustomers} from '../../context/CustomersContext';

import {Colors} from '../../constants/colors';

import BackButton from '../../components/ui/BackButton';

type CustomerDetailsRouteProp =
  RouteProp<MainStackParamList, 'CustomerDetails'>;

type CustomerDetailsNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function CustomerDetailsScreen() {
  const route = useRoute<CustomerDetailsRouteProp>();
  const navigation = useNavigation<CustomerDetailsNavigationProp>();

  const {customerId} = route.params;

  const {
    customers,
    loading,
    error,
  } = useCustomers();

  const customer = customers.find(
    item => item.id === customerId,
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>
            טוען פרטי לקוח...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !customer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <BackButton />

          <Text style={styles.errorText}>
            {error || 'הלקוח לא נמצא.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <BackButton />

          <Text style={styles.headerTitle}>
            פרטי לקוח
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.customerHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {customer.name
                ?.trim()
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>

          <Text style={styles.customerName}>
            {customer.name}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            פרטי קשר
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>
              {customer.phone || 'לא הוזן'}
            </Text>

            <Text style={styles.detailLabel}>
              טלפון
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>
              {customer.email || 'לא הוזן'}
            </Text>

            <Text style={styles.detailLabel}>
              אימייל
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={styles.detailValue}>
              {customer.address || 'לא הוזנה'}
            </Text>

            <Text style={styles.detailLabel}>
              כתובת
            </Text>
          </View>
        </View>

        {customer.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              הערות
            </Text>

            <Text style={styles.notes}>
              {customer.notes}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('EditCustomer', {
              customerId: customer.id,
            })
          }>
          <Text style={styles.editButtonText}>
            עריכת לקוח
          </Text>
        </TouchableOpacity>

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
    paddingTop: 16,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  headerPlaceholder: {
    width: 40,
  },

  customerHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
  },

  customerName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },

  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  detailValue: {
    flex: 1,
    marginRight: 20,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'left',
  },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },

  notes: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  editButton: {
    minHeight: 52,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  errorContainer: {
    flex: 1,
    padding: 20,
  },

  errorText: {
    marginTop: 30,
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
  },
});