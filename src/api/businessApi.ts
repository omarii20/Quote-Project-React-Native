import {apiRequest} from './apiClient';

export type Business = {
  id: number;
  firebase_uid: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type UpdateBusinessData = {
  business_name?: string;
  owner_name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  logo_url?: string | null;
};

type BusinessResponse = {
  success: boolean;
  business: Business;
};

export const getMyBusiness = async (): Promise<Business> => {
  const response = await apiRequest<BusinessResponse>(
    '/businesses/me',
    {
      method: 'GET',
    },
  );

  return response.business;
};
export const updateMyBusiness = async (
  data: UpdateBusinessData,
): Promise<Business> => {
  return apiRequest<Business>('/businesses/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};