import {apiRequest} from './apiClient';

export type Quote = {
  id: number;
  business_id: number;
  customer_id: number;
  quote_number: string;
  title: string;
  description: string;
  pricing_method: string;
  items_subtotal: number | string;
  additional_amount: number | string;
  subtotal: number | string;
  total?: number | string;
  status?: string;
  valid_until?: string;
  created_at?: string;
};

export const getQuotes = async (): Promise<Quote[]> => {
  return apiRequest<Quote[]>('/quotes', {
    method: 'GET',
  });
};