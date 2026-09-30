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

import {useTheme} from '../../context/ThemeContext';

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
  const {colors} = useTheme();

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
        <Text
          style={[
            styles.label,
            {color: colors.textPrimary},
          ]}>
          לקוח *
        </Text>

        <TouchableOpacity
          style={[
            styles.selector,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => setVisible(true)}>
          <Text
            style={[
              styles.selectorText,
              {
                color: selectedCustomer
                  ? colors.textPrimary
                  : colors.textSecondary,
              },
            ]}>
            {selectedCustomer
              ? selectedCustomer.name
              : 'בחר לקוח'}
          </Text>

          <Text
            style={[
              styles.arrow,
              {color: colors.textSecondary},
            ]}>
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
          <View
            style={[
              styles.modal,
              {backgroundColor: colors.surface},
            ]}>
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  {color: colors.textPrimary},
                ]}>
                {showCustomerForm
                  ? 'לקוח חדש'
                  : 'בחירת לקוח'}
              </Text>

              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.closeText,
                    {color: colors.textSecondary},
                  ]}>
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
                    style={[
                      styles.backToCustomersText,
                      {color: colors.primary},
                    ]}>
                    חזרה לרשימת הלקוחות
                  </Text>
                </TouchableOpacity>

                {createError ? (
                  <Text
                    style={[
                      styles.errorText,
                      {color: colors.danger},
                    ]}>
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
                  style={[
                    styles.searchInput,
                    {
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.background,
                    },
                  ]}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="חיפוש לפי שם או טלפון"
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  textAlign="right"
                />

                <TouchableOpacity
                  style={[
                    styles.addCustomerButton,
                    {borderColor: colors.primary},
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    setShowCustomerForm(true)
                  }>
                  <Text
                    style={[
                      styles.addCustomerText,
                      {color: colors.primary},
                    ]}>
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
                      style={[
                        styles.emptyText,
                        {color: colors.textSecondary},
                      ]}>
                      לא נמצאו לקוחות
                    </Text>
                  }
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.customerItem,
                        {
                          borderBottomColor:
                            colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() =>
                        handleSelect(item)
                      }>
                      <Text
                        style={[
                          styles.customerName,
                          {color: colors.textPrimary},
                        ]}>
                        {item.name}
                      </Text>

                      {!!item.phone && (
                        <Text
                          style={[
                            styles.customerPhone,
                            {
                              color:
                                colors.textSecondary,
                            },
                          ]}>
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
    textAlign: 'right',
  },

  selector: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectorText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },

  arrow: {
    marginRight: 12,
    fontSize: 11,
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
  },

  closeText: {
    fontSize: 20,
  },

  searchInput: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 15,
  },

  addCustomerButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  addCustomerText: {
    fontSize: 15,
    fontWeight: '700',
  },

  customerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  customerName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },

  customerPhone: {
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },

  emptyText: {
    paddingVertical: 30,
    textAlign: 'center',
  },

  backToCustomers: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },

  backToCustomersText: {
    fontSize: 14,
    fontWeight: '600',
  },

  errorText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'right',
  },
});