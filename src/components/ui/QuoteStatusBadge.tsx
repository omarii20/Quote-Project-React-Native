import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTheme} from '../../context/ThemeContext';

type Props = {
  status?: string;
};

type StatusStyle = {
  label: string;
  lightBackgroundColor: string;
  darkBackgroundColor: string;
  lightTextColor: string;
  darkTextColor: string;
};

const getStatusStyle = (
  status?: string,
): StatusStyle => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return {
        label: 'טיוטה',
        lightBackgroundColor: '#F3F4F6',
        darkBackgroundColor: '#374151',
        lightTextColor: '#6B7280',
        darkTextColor: '#D1D5DB',
      };

    case 'sent':
      return {
        label: 'נשלחה',
        lightBackgroundColor: '#EFF6FF',
        darkBackgroundColor: '#1E3A5F',
        lightTextColor: '#2563EB',
        darkTextColor: '#60A5FA',
      };

    case 'viewed':
      return {
        label: 'נצפתה',
        lightBackgroundColor: '#F5F3FF',
        darkBackgroundColor: '#3B2E5A',
        lightTextColor: '#7C3AED',
        darkTextColor: '#A78BFA',
      };

    case 'approved':
      return {
        label: 'אושרה',
        lightBackgroundColor: '#F0FDF4',
        darkBackgroundColor: '#173D2A',
        lightTextColor: '#16A34A',
        darkTextColor: '#4ADE80',
      };

    case 'rejected':
      return {
        label: 'נדחתה',
        lightBackgroundColor: '#FEF2F2',
        darkBackgroundColor: '#4A2025',
        lightTextColor: '#DC2626',
        darkTextColor: '#F87171',
      };

    case 'expired':
      return {
        label: 'פג תוקף',
        lightBackgroundColor: '#FFF7ED',
        darkBackgroundColor: '#4A2D18',
        lightTextColor: '#EA580C',
        darkTextColor: '#FB923C',
      };

    default:
      return {
        label: status || 'טיוטה',
        lightBackgroundColor: '#F3F4F6',
        darkBackgroundColor: '#374151',
        lightTextColor: '#6B7280',
        darkTextColor: '#D1D5DB',
      };
  }
};

export default function QuoteStatusBadge({
  status,
}: Props) {
  const {resolvedTheme} = useTheme();

  const statusStyle = getStatusStyle(status);

  const backgroundColor =
    resolvedTheme === 'dark'
      ? statusStyle.darkBackgroundColor
      : statusStyle.lightBackgroundColor;

  const textColor =
    resolvedTheme === 'dark'
      ? statusStyle.darkTextColor
      : statusStyle.lightTextColor;

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor},
      ]}>
      <Text
        style={[
          styles.text,
          {color: textColor},
        ]}>
        {statusStyle.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});