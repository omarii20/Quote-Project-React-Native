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
import {useTheme} from '../../context/ThemeContext';

import BackButton from '../../components/ui/BackButton';

export default function CreateCustomerScreen() {
  const navigation = useNavigation();
  const {addCustomer} = useCustomers();
  const {colors} = useTheme();

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
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <BackButton />

          <Text
            style={[
              styles.title,
              {color: colors.textPrimary},
            ]}>
            לקוח חדש
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <Text
            style={[
              styles.subtitle,
              {color: colors.textPrimary},
            ]}>
            פרטי הלקוח
          </Text>

          {error ? (
            <Text
              style={[
                styles.errorText,
                {color: colors.danger},
              ]}>
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
  },

  headerPlaceholder: {
    width: 40,
  },

  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
  },

  subtitle: {
    marginBottom: 4,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },

  errorText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'right',
  },
});