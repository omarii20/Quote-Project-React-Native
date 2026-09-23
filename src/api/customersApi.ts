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

export type CreateCustomerData = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
};

type CustomersResponse = {
  success: boolean;
  customers: Customer[];
};

type CreateCustomerResponse = {
  success: boolean;
  customer: Customer;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await apiRequest<CustomersResponse>('/customers',
      {
        method: 'GET',
      },
    );

  return response.customers;
};

export const createCustomer = async (data: CreateCustomerData): Promise<Customer> => {
  const response =await apiRequest<CreateCustomerResponse>( '/customers',
    {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

  return response.customer;
};