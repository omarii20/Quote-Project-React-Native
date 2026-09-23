import React, {
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../constants/colors';

import type {
  Customer,
  CreateCustomerData,
} from '../../api/customersApi';

import CustomerForm from './CustomerForm';

type Props = {
  customers: Customer[];
  selectedCustomer: Customer | null;

  onSelectCustomer: (
    customer: Customer,
  ) => void;

  onAddCustomer: (
    data: CreateCustomerData,
  ) => Promise<Customer>;

  creatingCustomer?: boolean;
};

export default function CustomerSelector({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  creatingCustomer = false,
}: Props) {
  const [visible, setVisible] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [showCustomerForm, setShowCustomerForm] =
    useState(false);

  const [createError, setCreateError] =
    useState('');

  const filteredCustomers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(customer => {
      const name =
        customer.name?.toLowerCase() ?? '';

      const phone =
        customer.phone?.toLowerCase() ?? '';

      return (
        name.includes(query) ||
        phone.includes(query)
      );
    });
  }, [customers, search]);

  const resetModal = () => {
    setSearch('');
    setShowCustomerForm(false);
    setCreateError('');
  };

  const handleClose = () => {
    setVisible(false);
    resetModal();
  };

  const handleSelect = (
    customer: Customer,
  ) => {
    onSelectCustomer(customer);
    handleClose();
  };

  const handleCreateCustomer = async (
    data: CreateCustomerData,
  ) => {
    try {
      setCreateError('');

      const newCustomer =
        await onAddCustomer(data);

      onSelectCustomer(newCustomer);

      handleClose();
    } catch (error) {
      console.log(
        'Create customer error:',
        error,
      );

      setCreateError(
        'לא הצלחנו ליצור את הלקוח.',
      );
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          לקוח *
        </Text>

        <TouchableOpacity
          style={styles.selector}
          activeOpacity={0.7}
          onPress={() => setVisible(true)}>
          <Text
            style={[
              styles.selectorText,
              !selectedCustomer &&
                styles.placeholder,
            ]}>
            {selectedCustomer
              ? selectedCustomer.name
              : 'בחר לקוח'}
          </Text>

          <Text style={styles.arrow}>
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showCustomerForm
                  ? 'לקוח חדש'
                  : 'בחירת לקוח'}
              </Text>

              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}>
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {showCustomerForm ? (
              <>
                <TouchableOpacity
                  style={styles.backToCustomers}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowCustomerForm(false);
                    setCreateError('');
                  }}>
                  <Text
                    style={
                      styles.backToCustomersText
                    }>
                    חזרה לרשימת הלקוחות
                  </Text>
                </TouchableOpacity>

                {createError ? (
                  <Text style={styles.errorText}>
                    {createError}
                  </Text>
                ) : null}

                <CustomerForm
                  onSubmit={
                    handleCreateCustomer
                  }
                  loading={
                    creatingCustomer
                  }
                />
              </>
            ) : (
              <>
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="חיפוש לפי שם או טלפון"
                  placeholderTextColor={
                    Colors.textSecondary
                  }
                  textAlign="right"
                />

                <TouchableOpacity
                  style={styles.addCustomerButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowCustomerForm(true)
                  }>
                  <Text
                    style={
                      styles.addCustomerText
                    }>
                    + הוסף לקוח חדש
                  </Text>
                </TouchableOpacity>

                <FlatList
                  data={filteredCustomers}
                  keyExtractor={item =>
                    item.id.toString()
                  }
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      style={styles.emptyText}>
                      לא נמצאו לקוחות
                    </Text>
                  }
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={
                        styles.customerItem
                      }
                      activeOpacity={0.7}
                      onPress={() =>
                        handleSelect(item)
                      }>
                      <Text
                        style={
                          styles.customerName
                        }>
                        {item.name}
                      </Text>

                      {!!item.phone && (
                        <Text
                          style={
                            styles.customerPhone
                          }>
                          {item.phone}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  selector: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectorText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  placeholder: {
    color: Colors.textSecondary,
  },

  arrow: {
    marginRight: 12,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },

  modal: {
    maxHeight: '85%',
    minHeight: '55%',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  closeText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },

  searchInput: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    marginBottom: 12,
    fontSize: 15,
  },

  addCustomerButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  addCustomerText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  customerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  customerPhone: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  emptyText: {
    paddingVertical: 30,
    textAlign: 'center',
    color: Colors.textSecondary,
  },

  backToCustomers: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },

  backToCustomersText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  errorText: {
    marginTop: 10,
    color: Colors.danger,
    fontSize: 14,
    textAlign: 'right',
  },
});
