import React from 'react';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import CreateQuoteScreen from '../screens/quotes/CreateQuoteScreen';
import QuoteDetailsScreen from '../screens/quotes/QuoteDetailsScreen';
import {
  QuotesProvider,
} from '../context/QuotesContext';
import EditQuoteScreen from '../screens/quotes/EditQuoteScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  CreateQuote: undefined;
  QuoteDetails: {
    quoteId: number;
  };
  EditQuote: {
    quoteId: number;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <QuotesProvider>
      <Stack.Navigator
        screenOptions={{headerShown: false, }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator}/>
        <Stack.Screen name="CreateQuote" component={CreateQuoteScreen} />
        <Stack.Screen name="QuoteDetails" component={QuoteDetailsScreen}/>
        <Stack.Screen name="EditQuote" component={EditQuoteScreen}/>
      </Stack.Navigator>
    </QuotesProvider>
  );
}