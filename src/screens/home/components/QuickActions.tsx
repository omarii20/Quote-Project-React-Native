import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {Colors} from '../../../constants/colors';

export default function QuickActions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        פעולות מהירות
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}>

          <Text style={styles.primaryButtonText}>
            + הצעה חדשה
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}>

          <Text style={styles.secondaryButtonText}>
            + לקוח חדש
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  title: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right',
  },

  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});