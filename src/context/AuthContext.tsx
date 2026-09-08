import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
  type User,
} from '@react-native-firebase/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;

  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] =useState<ConfirmationResult | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const convertToE164 = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '');

    if (cleanedPhone.startsWith('0')) {
      return `+972${cleanedPhone.slice(1)}`;
    }

    if (cleanedPhone.startsWith('972')) {
      return `+${cleanedPhone}`;
    }

    return phone;
  };

  const sendOTP = async (phone: string) => {
    try {
      const formattedPhone = convertToE164(phone);

      console.log('Sending OTP to:', formattedPhone);

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
      );

      setConfirmation(result);

      console.log('OTP request created successfully');
    } catch (error) {
      console.log('Send OTP error:', error);

      throw error;
    }
  };

  const verifyOTP = async (code: string) => {
    try {
      if (!confirmation) {
        throw new Error('No OTP confirmation exists');
      }

      console.log('Verifying OTP:', code);

      const result = await confirmation.confirm(code);

      console.log('Firebase user authenticated:', result.user.uid);

      setConfirmation(null);
    } catch (error) {
      console.log('Verify OTP error:', error);

      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      setConfirmation(null);
    } catch (error) {
      console.log('Logout error:', error);

      throw error;
    }
  };

  const getToken = async (): Promise<string | null> => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    return currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sendOTP,
        verifyOTP,
        logout,
        getToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}