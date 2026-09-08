import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  status?: string;
};

type StatusStyle = {
  label: string;
  backgroundColor: string;
  textColor: string;
};

const getStatusStyle = (
  status?: string,
): StatusStyle => {
  switch (status?.toLowerCase()) {
    case 'draft':
      return {
        label: 'טיוטה',
        backgroundColor: '#F3F4F6',
        textColor: '#6B7280',
      };

    case 'sent':
      return {
        label: 'נשלחה',
        backgroundColor: '#EFF6FF',
        textColor: '#2563EB',
      };

    case 'viewed':
      return {
        label: 'נצפתה',
        backgroundColor: '#F5F3FF',
        textColor: '#7C3AED',
      };

    case 'approved':
      return {
        label: 'אושרה',
        backgroundColor: '#F0FDF4',
        textColor: '#16A34A',
      };

    case 'rejected':
      return {
        label: 'נדחתה',
        backgroundColor: '#FEF2F2',
        textColor: '#DC2626',
      };

    case 'expired':
      return {
        label: 'פג תוקף',
        backgroundColor: '#FFF7ED',
        textColor: '#EA580C',
      };

    default:
      return {
        label: status || 'טיוטה',
        backgroundColor: '#F3F4F6',
        textColor: '#6B7280',
      };
  }
};

export default function QuoteStatusBadge({
  status,
}: Props) {
  const statusStyle = getStatusStyle(status);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            statusStyle.backgroundColor,
        },
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: statusStyle.textColor,
          },
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