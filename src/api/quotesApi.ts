import {apiRequest} from './apiClient';

export type PricingMethod =
  | 'items'
  | 'manual';

export type DiscountType =
  | 'percent'
  | 'fixed';

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'approved'
  | 'rejected'
  | 'expired';

export type QuoteItem = {
  id: number;

  quote_id: number;

  description: string;

  quantity: number | string;

  unit_price: number | string;

  total: number | string;

  total_overridden: boolean;

  position: number;

  created_at?: string;

  updated_at?: string;
};

export type Quote = {
  id: number;
  
  customer?: QuoteCustomer;

  business_id: number;

  customer_id: number;

  quote_number: string;

  title?: string;

  description?: string;

  pricing_method: PricingMethod;

  items_subtotal: number | string;

  manual_subtotal?: number | string | null;

  additional_amount: number | string;

  subtotal: number | string;

  discount_type?: DiscountType | null;

  discount_value: number | string;

  discount_amount: number | string;

  vat_rate: number | string;

  vat_amount: number | string;

  total: number | string;

  status: QuoteStatus;

  valid_until?: string | null;

  notes?: string;

  items?: QuoteItem[];

  created_at?: string;

  updated_at?: string;
};

export type CreateQuoteItemData = {
  description: string;

  quantity: number;

  unit_price: number;

  total_overridden: boolean;

  position: number;
};

export type CreateQuoteData = {
  customer_id: number;
  title?: string;
  description?: string;
  pricing_method: PricingMethod;
  manual_subtotal?: number | null;
  additional_amount?: number;
  discount_type?: DiscountType | null;
  discount_value: number;
  vat_rate: number;
  status: QuoteStatus;
  valid_until?: string | null;
  notes?: string;
  items?: CreateQuoteItemData[];
};

export type UpdateQuoteData = {
  customer_id: number;
  title?: string;
  description?: string;
  pricing_method: PricingMethod;
  manual_subtotal?: number | null;
  additional_amount: number;
  discount_type?: DiscountType | null;
  discount_value: number;
  vat_rate: number;
  valid_until?: string | null;
  notes?: string;
  items: CreateQuoteItemData[];
};

export type QuoteCustomer = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export const getQuotes =async (): Promise<Quote[]> => {
    return apiRequest<Quote[]>('/quotes',
      {
        method: 'GET',
      },
    );
  };

export const createQuote = async (data: CreateQuoteData,): Promise<Quote> => {
  return apiRequest<Quote>('/quotes',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
};

export const getQuoteById = async (quoteId: number): Promise<Quote> => {
  return apiRequest<Quote>(`/quotes/${quoteId}`,
    {
      method: 'GET',
    },
  );
};

export const updateQuote = async (quoteId: number,data: UpdateQuoteData): Promise<Quote> => {
  return apiRequest<Quote>(`/quotes/${quoteId}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  );
};