import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getCustomers,
  type Customer,
} from '../api/customersApi';

type CustomersContextType = {
  customers: Customer[];
  loading: boolean;
  error: string;
  refreshCustomers: () => Promise<void>;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  removeCustomer: (customerId: number) => void;
};

const CustomersContext = createContext<CustomersContextType | undefined>(
  undefined,
);

export function CustomersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getCustomers();

      setCustomers(data);
    } catch (err) {
      console.log('Load customers error:', err);

      setError('לא הצלחנו לטעון את הלקוחות.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(current => [
      ...current,
      customer,
    ]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(current =>
      current.map(item =>
        item.id === customer.id
          ? customer
          : item,
      ),
    );
  };

  const removeCustomer = (customerId: number) => {
    setCustomers(current =>
      current.filter(
        customer => customer.id !== customerId,
      ),
    );
  };

  useEffect(() => {
    refreshCustomers();
  }, []);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        error,
        refreshCustomers,
        addCustomer,
        updateCustomer,
        removeCustomer,
      }}>
      {children}
    </CustomersContext.Provider>
  );
}

export const useCustomers = () => {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error(
      'useCustomers must be used inside CustomersProvider',
    );
  }

  return context;
};