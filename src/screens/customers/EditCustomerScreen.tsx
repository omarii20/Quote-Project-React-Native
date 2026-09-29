import React, {useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  updateCustomer,
  type CreateCustomerData,
} from '../../api/customersApi';

import {useCustomers} from '../../context/CustomersContext';

import CustomerForm from './CustomerForm';

import BackButton from '../../components/ui/BackButton';

import {Colors} from '../../constants/colors';

import type {MainStackParamList} from '../../navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

type RouteProp = NativeStackScreenProps<MainStackParamList,'EditCustomer'>['route'];

export default function EditCustomerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  const {customers, updateCustomer: updateCustomerContext} = useCustomers();

  const {customerId} = route.params;

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const customer = customers.find(
    item => item.id === customerId,
  );

  const handleUpdateCustomer = async (data: CreateCustomerData) => {
    if (!customer || updating) {
      return;
    }

    try {
      setUpdating(true);
      setError('');

      const updatedCustomer = await updateCustomer(
        customer.id,
        data,
      );

      updateCustomerContext(updatedCustomer);

      navigation.goBack();
    } catch (err) {
      console.log('Update customer error:', err);

      setError('לא הצלחנו לעדכן את הלקוח.');
    } finally {
      setUpdating(false);
    }
  };

  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            הלקוח לא נמצא.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <BackButton />

          <Text style={styles.title}>
            עריכת לקוח
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>
            פרטי הלקוח
          </Text>

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <CustomerForm
            initialValues={customer}
            onSubmit={handleUpdateCustomer}
            loading={updating}
            submitLabel="שמור שינויים"
          />
        </View>
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
    marginBottom: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  headerPlaceholder: {
    width: 40,
  },

  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },

  subtitle: {
    marginBottom: 4,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    marginTop: 12,
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'right',
  },
});