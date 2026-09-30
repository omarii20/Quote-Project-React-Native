import React, {useMemo, useState} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useCustomers} from '../../context/CustomersContext';
import {useTheme} from '../../context/ThemeContext';

import type {MainStackParamList} from '../../navigation/MainNavigator';

type CustomersNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function CustomersScreen() {
  const navigation = useNavigation<CustomersNavigationProp>();
  const {colors} = useTheme();

  const {
    customers,
    loading,
    error,
  } = useCustomers();

  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter(customer => {
      return (
        customer.name?.toLowerCase().includes(value) ||
        customer.phone?.includes(value) ||
        customer.email?.toLowerCase().includes(value)
      );
    });
  }, [customers, search]);

  const getInitials = (name: string) => {
    if (!name) {
      return '?';
    }

    const parts = name
      .trim()
      .split(' ')
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
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
          <Text
            style={[
              styles.title,
              {color: colors.textPrimary},
            ]}>
            לקוחות
          </Text>

          <Text
            style={[
              styles.subtitle,
              {color: colors.textSecondary},
            ]}>
            ניהול הלקוחות של העסק
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.addButton,
              {backgroundColor: colors.primary},
            ]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CreateCustomer')
            }>
            <Text style={styles.addButtonText}>
              + לקוח חדש
            </Text>
          </TouchableOpacity>

          <View style={styles.customerCount}>
            <Text
              style={[
                styles.customerCountValue,
                {color: colors.primary},
              ]}>
              {customers.length}
            </Text>

            <Text
              style={[
                styles.customerCountLabel,
                {color: colors.textSecondary},
              ]}>
              לקוחות
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="חיפוש לפי שם, טלפון או אימייל"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.searchInput,
              {color: colors.textPrimary},
            ]}
            textAlign="right"
          />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />

            <Text
              style={[
                styles.loadingText,
                {color: colors.textSecondary},
              ]}>
              טוען לקוחות...
            </Text>
          </View>
        ) : error ? (
          <View
            style={[
              styles.messageCard,
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
        ) : filteredCustomers.length === 0 ? (
          <View
            style={[
              styles.messageCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.emptyTitle,
                {color: colors.textPrimary},
              ]}>
              לא נמצאו לקוחות
            </Text>

            <Text
              style={[
                styles.emptyText,
                {color: colors.textSecondary},
              ]}>
              {search
                ? 'לא נמצאו לקוחות התואמים לחיפוש.'
                : 'הלקוחות שתוסיף לעסק יופיעו כאן.'}
            </Text>
          </View>
        ) : (
          <View style={styles.customersList}>
            {filteredCustomers.map(customer => (
              <TouchableOpacity
                key={customer.id}
                style={[
                  styles.customerCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('CustomerDetails', {
                    customerId: customer.id,
                  })
                }>

                <View style={styles.customerHeader}>
                  <View
                    style={[
                      styles.avatar,
                      {backgroundColor: colors.surfaceSecondary},
                    ]}>
                    <Text
                      style={[
                        styles.avatarText,
                        {color: colors.primary},
                      ]}>
                      {getInitials(customer.name)}
                    </Text>
                  </View>

                  <View style={styles.customerInfo}>
                    <Text
                      style={[
                        styles.customerName,
                        {color: colors.textPrimary},
                      ]}>
                      {customer.name}
                    </Text>

                    {customer.phone ? (
                      <Text
                        style={[
                          styles.customerDetail,
                          {color: colors.textSecondary},
                        ]}>
                        {customer.phone}
                      </Text>
                    ) : null}

                    {customer.email ? (
                      <Text
                        style={[
                          styles.customerDetail,
                          {color: colors.textSecondary},
                        ]}>
                        {customer.email}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {customer.address ? (
                  <View
                    style={[
                      styles.cardFooter,
                      {borderTopColor: colors.border},
                    ]}>
                    <Text
                      style={[
                        styles.address,
                        {color: colors.textSecondary},
                      ]}>
                      {customer.address}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
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

  header: {
    alignItems: 'flex-end',
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'right',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  addButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  customerCount: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },

  customerCountValue: {
    fontSize: 17,
    fontWeight: '700',
  },

  customerCountLabel: {
    fontSize: 14,
  },

  searchContainer: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },

  searchInput: {
    minHeight: 50,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  messageCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },

  customersList: {
    gap: 12,
  },

  customerCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },

  customerHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },

  avatarText: {
    fontSize: 17,
    fontWeight: '700',
  },

  customerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },

  customerName: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'right',
  },

  customerDetail: {
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },

  cardFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },

  address: {
    fontSize: 13,
    textAlign: 'right',
  },
});