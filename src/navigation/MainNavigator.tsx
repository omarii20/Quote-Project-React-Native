import React from 'react';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';

import CreateQuoteScreen from '../screens/quotes/CreateQuoteScreen';
import QuoteDetailsScreen from '../screens/quotes/QuoteDetailsScreen';
import EditQuoteScreen from '../screens/quotes/EditQuoteScreen';
import QuotePdfPreviewScreen from '../screens/quotes/QuotePdfPreviewScreen';

import CustomerDetailsScreen from '../screens/customers/CustomerDetailsScreen';
import CreateCustomerScreen from '../screens/customers/CreateCustomerScreen';
import EditCustomerScreen from '../screens/customers/EditCustomerScreen';

import {CustomersProvider} from '../context/CustomersContext';
import {QuotesProvider} from '../context/QuotesContext';
import { BusinessProvider } from '../context/BusinessContext';

export type MainStackParamList = {
  MainTabs: undefined;

  CreateQuote: undefined;

  QuoteDetails: {
    quoteId: number;
  };

  EditQuote: {
    quoteId: number;
  };

  // PDF Preview
  QuotePdfPreview: {
    quoteId: number;
    quoteNumber: string;
  };

  CustomerDetails: {
    customerId: number;
  };

  CreateCustomer: undefined;

  EditCustomer: {
    customerId: number;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <BusinessProvider>
      <QuotesProvider>
        <CustomersProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>

            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
            />

            <Stack.Screen
              name="CreateQuote"
              component={CreateQuoteScreen}
            />

            <Stack.Screen
              name="QuoteDetails"
              component={QuoteDetailsScreen}
            />

            <Stack.Screen
              name="EditQuote"
              component={EditQuoteScreen}
            />

            <Stack.Screen
              name="QuotePdfPreview"
              component={QuotePdfPreviewScreen}
            />

            <Stack.Screen
              name="CustomerDetails"
              component={CustomerDetailsScreen}
            />

            <Stack.Screen
              name="CreateCustomer"
              component={CreateCustomerScreen}
            />

            <Stack.Screen
              name="EditCustomer"
              component={EditCustomerScreen}
            />

          </Stack.Navigator>
        </CustomersProvider>
      </QuotesProvider>
    </BusinessProvider>
  );
}