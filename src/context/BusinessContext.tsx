import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getMyBusiness,
  type Business,
} from '../api/businessApi';

type BusinessContextType = {
  business: Business | null;
  loading: boolean;
  error: string;
  refreshBusiness: () => Promise<void>;
  setBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
};

const BusinessContext = createContext<
  BusinessContextType | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

export function BusinessProvider({children}: Props) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshBusiness = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyBusiness();
    //   console.log('Business data loaded:', data);  
      setBusiness(data);
    } catch (err) {
      console.error('Load business error:', err);

      setError('לא הצלחנו לטעון את פרטי העסק.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBusiness();
  }, [refreshBusiness]);

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        error,
        refreshBusiness,
        setBusiness,
      }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error(
      'useBusiness must be used inside BusinessProvider',
    );
  }

  return context;
}