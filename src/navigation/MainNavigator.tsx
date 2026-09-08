import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home/HomeScreen';
import CustomersScreen from '../screens/customers/CustomersScreen';
import QuotesScreen from '../screens/quotes/QuotesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

import { QuotesProvider} from '../context/QuotesContext';

export type MainTabParamList = {
  Home: undefined;
  Customers: undefined;
  Quotes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <QuotesProvider>
      <Tab.Navigator screenOptions={{headerShown: false, }}>
        <Tab.Screen name="Home"component={HomeScreen}/>
        <Tab.Screen name="Customers" component={CustomersScreen}/>
        <Tab.Screen name="Quotes" component={QuotesScreen} />
        <Tab.Screen name="Settings"component={SettingsScreen}/>
      </Tab.Navigator>
    </QuotesProvider>
  );
}