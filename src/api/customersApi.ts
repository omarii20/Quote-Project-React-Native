import {apiRequest} from './apiClient';

export type Customer = {
  id: number;
  business_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

type CustomersResponse = {
  customers: Customer[];
};

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await apiRequest<CustomersResponse>('/customers',{
      method: 'GET',
    },
  );

  return response.customers;
};