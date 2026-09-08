import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';
import {
  getCustomers,
  type Customer,
} from '../../api/customersApi';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getCustomers();

        console.log('Customers response:', data);

        setCustomers(data);
      } catch (err) {
        console.log('Load customers error:', err);

        setError('לא הצלחנו לטעון את הלקוחות.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.title}>
            לקוחות
          </Text>

          <Text style={styles.subtitle}>
            ניהול הלקוחות של העסק
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}>
            <Text style={styles.addButtonText}>
              + לקוח חדש
            </Text>
          </TouchableOpacity>

          <View style={styles.customerCount}>
            <Text style={styles.customerCountValue}>
              {customers.length}
            </Text>

            <Text style={styles.customerCountLabel}>
              לקוחות
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="חיפוש לפי שם, טלפון או אימייל"
            placeholderTextColor={Colors.textSecondary}
            style={styles.searchInput}
            textAlign="right"
          />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color={Colors.primary}
            />

            <Text style={styles.loadingText}>
              טוען לקוחות...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.emptyTitle}>
              לא נמצאו לקוחות
            </Text>

            <Text style={styles.emptyText}>
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
                style={styles.customerCard}
                activeOpacity={0.8}>

                <View style={styles.customerHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(customer.name)}
                    </Text>
                  </View>

                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>
                      {customer.name}
                    </Text>

                    {customer.phone ? (
                      <Text style={styles.customerDetail}>
                        {customer.phone}
                      </Text>
                    ) : null}

                    {customer.email ? (
                      <Text style={styles.customerDetail}>
                        {customer.email}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {customer.address ? (
                  <View style={styles.cardFooter}>
                    <Text style={styles.address}>
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
    backgroundColor: Colors.background,
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
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  addButton: {
    backgroundColor: Colors.primary,
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
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
  },

  customerCountLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  searchContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },

  searchInput: {
    minHeight: 50,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  centerContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },

  messageCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  customersList: {
    gap: 12,
  },

  customerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  customerHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },

  avatarText: {
    color: Colors.primary,
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
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  customerDetail: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  cardFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
  },

  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
});