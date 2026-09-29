import React, {useState} from 'react';
import {
ActivityIndicator,
  Alert,  
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
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {deleteCustomer} from '../../api/customersApi';
import {ApiError} from '../../api/apiClient';

import {Colors} from '../../constants/colors';
import BackButton from '../../components/ui/BackButton';

type CustomerDetailsRouteProp =
  RouteProp<MainStackParamList, 'CustomerDetails'>;

type CustomerDetailsNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function CustomerDetailsScreen() {
  const route = useRoute<CustomerDetailsRouteProp>();
  const navigation = useNavigation<CustomerDetailsNavigationProp>();
  const [deleting, setDeleting] = useState(false);
  const {customerId} = route.params;

  const {
    customers,
    loading,
    error,
    removeCustomer,
  } = useCustomers();

  const customer = customers.find(
    item => item.id === customerId,
  );

  const handleDeleteCustomer = () => {
    if (!customer || deleting) {
        return;
    }

    Alert.alert(
        'מחיקת לקוח',
        `האם אתה בטוח שברצונך למחוק את ${customer.name}?`,
        [
        {
            text: 'ביטול',
            style: 'cancel',
        },
        {
            text: 'מחיקה',
            style: 'destructive',
            onPress: async () => {
            try {
                setDeleting(true);

                await deleteCustomer(customer.id);

                removeCustomer(customer.id);

                navigation.goBack();
            } catch (err) {
                console.log('Delete customer error:', err);

                if (err instanceof ApiError && err.status === 409) {
                    Alert.alert(
                    'לא ניתן למחוק את הלקוח',
                    'קיימות הצעות מחיר המשויכות ללקוח הזה.',
                    );

                    return;
                }

                Alert.alert(
                    'שגיאה',
                    'לא הצלחנו למחוק את הלקוח.',
                );
                } finally {
                setDeleting(false);
            }
            },
        },
        ],
    );
    };

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

        <TouchableOpacity
            style={styles.deleteIconButton}
            activeOpacity={0.7}
            disabled={deleting}
            onPress={handleDeleteCustomer}>
            {deleting ? (
            <ActivityIndicator
                size="small"
                color={Colors.danger}
            />
            ) : (
            <MaterialDesignIcons
                name="delete-outline"
                size={24}
                color={Colors.danger}
            />
            )}
        </TouchableOpacity>
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
  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },
});