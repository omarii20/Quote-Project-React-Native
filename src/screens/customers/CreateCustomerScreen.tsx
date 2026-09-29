import React, {useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {
  createCustomer,
  type CreateCustomerData,
} from '../../api/customersApi';

import CustomerForm from './CustomerForm';
import {useCustomers} from '../../context/CustomersContext';

import BackButton from '../../components/ui/BackButton';
import {Colors} from '../../constants/colors';

export default function CreateCustomerScreen() {
  const navigation = useNavigation();
  const {addCustomer} = useCustomers();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    try {
      setCreating(true);
      setError('');

      const newCustomer = await createCustomer(data);
      addCustomer(newCustomer);
      navigation.goBack();
    } catch (err) {
      console.log('Create customer error:', err);

      setError('לא הצלחנו ליצור את הלקוח.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <BackButton />

          <Text style={styles.title}>
            לקוח חדש
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
            onSubmit={handleCreateCustomer}
            loading={creating}
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

  errorText: {
    marginTop: 12,
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'right',
  },
});