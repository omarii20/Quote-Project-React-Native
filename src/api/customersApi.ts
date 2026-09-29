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

export type UpdateCustomerData = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
};

type CustomersResponse = {
  success: boolean;
  customers: Customer[];
};

type CustomerResponse = {
  success: boolean;
  customer: Customer;
};

type CreateCustomerResponse = {
  success: boolean;
  customer: Customer;
};

type DeleteCustomerResponse = {
  success: boolean;
  message: string;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await apiRequest<CustomersResponse>('/customers',
    {
      method: 'GET',
    },
  );

  return response.customers;
};

export const getCustomerById = async (customerId: number): Promise<Customer> => {
  const response = await apiRequest<CustomerResponse>(`/customers/${customerId}`,
    {
      method: 'GET',
    },
  );

  return response.customer;
};

export const createCustomer = async (data: CreateCustomerData): Promise<Customer> => {
  const response = await apiRequest<CreateCustomerResponse>('/customers',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );

  return response.customer;
};

export const updateCustomer = async (customerId: number,data: UpdateCustomerData,): Promise<Customer> => {
  const response = await apiRequest<CustomerResponse>(`/customers/${customerId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );

  return response.customer;
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
  await apiRequest<DeleteCustomerResponse>(`/customers/${customerId}`,
    {
      method: 'DELETE',
    },
  );
};