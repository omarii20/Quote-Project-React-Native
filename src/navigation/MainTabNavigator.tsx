
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

import {
  House,
  UsersRound,
  FileText,
  Settings,
} from 'lucide-react-native';

import HomeScreen from '../screens/home/HomeScreen';
import CustomersScreen from '../screens/customers/CustomersScreen';
import QuotesScreen from '../screens/quotes/QuotesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

import {useTheme} from '../context/ThemeContext';

export type MainTabParamList = {
  Home: undefined;
  Customers: undefined;
  Quotes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// --------------------------------------------------
// Tab Icons
// --------------------------------------------------

type TabIconProps = {
  name: keyof MainTabParamList;
  color: string;
  size: number;
  focused: boolean;
};

function TabIcon({
  name,
  color,
  size,
  focused,
}: TabIconProps) {
  const iconProps = {
    size,
    color,
    strokeWidth: focused ? 2.5 : 2,
  };

  let icon: React.ReactNode;

  switch (name) {
    case 'Home':
      icon = <House {...iconProps} />;
      break;

    case 'Customers':
      icon = <UsersRound {...iconProps} />;
      break;

    case 'Quotes':
      icon = <FileText {...iconProps} />;
      break;

    case 'Settings':
      icon = <Settings {...iconProps} />;
      break;
  }

  return (
    <View style={styles.iconContainer}>
      {icon}
    </View>
  );
}

// --------------------------------------------------
// Tab Labels
// --------------------------------------------------

type TabLabelProps = {
  title: string;
  color: string;
  focused: boolean;
};

function TabLabel({
  title,
  color,
  focused,
}: TabLabelProps) {
  return (
    <View style={styles.labelContainer}>
      <Text
        style={[
          styles.labelText,
          {color},
          focused && styles.activeLabelText,
        ]}>
        {title}
      </Text>

      {focused && (
        <View
          style={[
            styles.activeIndicator,
            {backgroundColor: color},
          ]}
        />
      )}
    </View>
  );
}

// --------------------------------------------------
// Stable Icon Renderers
// --------------------------------------------------

type TabBarIcon = NonNullable<
  BottomTabNavigationOptions['tabBarIcon']
>;

const homeIcon: TabBarIcon = props => (
  <TabIcon name="Home" {...props} />
);

const customersIcon: TabBarIcon = props => (
  <TabIcon name="Customers" {...props} />
);

const quotesIcon: TabBarIcon = props => (
  <TabIcon name="Quotes" {...props} />
);

const settingsIcon: TabBarIcon = props => (
  <TabIcon name="Settings" {...props} />
);

// --------------------------------------------------
// Stable Label Renderers
// --------------------------------------------------

type TabBarLabel = NonNullable<
  BottomTabNavigationOptions['tabBarLabel']
>;

const homeLabel: TabBarLabel = props => (
  <TabLabel title="בית" {...props} />
);

const customersLabel: TabBarLabel = props => (
  <TabLabel title="לקוחות" {...props} />
);

const quotesLabel: TabBarLabel = props => (
  <TabLabel title="הצעות מחיר" {...props} />
);

const settingsLabel: TabBarLabel = props => (
  <TabLabel title="הגדרות" {...props} />
);

// --------------------------------------------------
// Tab Options
// --------------------------------------------------

const homeOptions: BottomTabNavigationOptions = {
  tabBarIcon: homeIcon,
  tabBarLabel: homeLabel,
};

const customersOptions: BottomTabNavigationOptions = {
  tabBarIcon: customersIcon,
  tabBarLabel: customersLabel,
};

const quotesOptions: BottomTabNavigationOptions = {
  tabBarIcon: quotesIcon,
  tabBarLabel: quotesLabel,
};

const settingsOptions: BottomTabNavigationOptions = {
  tabBarIcon: settingsIcon,
  tabBarLabel: settingsLabel,
};

// --------------------------------------------------
// Main Tab Navigator
// --------------------------------------------------

export default function MainTabNavigator() {
  const {colors, resolvedTheme} = useTheme();

  const activeColor =
    resolvedTheme === 'dark'
      ? colors.textPrimary
      : colors.primary;

  const inactiveColor = colors.textSecondary;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          writingDirection: 'rtl',
        },
      }}>

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={settingsOptions}
      />

      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={quotesOptions}
      />

      <Tab.Screen
        name="Customers"
        component={CustomersScreen}
        options={customersOptions}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={homeOptions}
      />

    </Tab.Navigator>
  );
}

// --------------------------------------------------
// Styles
// --------------------------------------------------

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  labelContainer: {
    minHeight: 29,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },

  labelText: {
    fontSize: 11,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'center',
  },

  activeLabelText: {
    fontWeight: '700',
  },

  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 3,
  },
});
