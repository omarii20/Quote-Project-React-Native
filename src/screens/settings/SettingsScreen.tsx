import React, {useState} from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useAuth} from '../../context/AuthContext';
import {ThemeMode, useTheme} from '../../context/ThemeContext';

export default function SettingsScreen() {
  const {themeMode, colors, setThemeMode} = useTheme();
  const {logout} = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const themeOptions: {label: string; value: ThemeMode}[] = [
    {label: 'בהיר', value: 'light'},
    {label: 'כהה', value: 'dark'},
    {label: 'מערכת', value: 'system'},
  ];

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();
    } catch (error) {
      console.log('Settings logout error:', error);

      setIsLoggingOut(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background},
      ]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {color: colors.textPrimary},
          ]}>
          הגדרות
        </Text>

        <Text
          style={[
            styles.headerDescription,
            {color: colors.textSecondary},
          ]}>
          התאמה אישית של האפליקציה
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}>
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {color: colors.textPrimary},
            ]}>
            מראה
          </Text>

          <Text
            style={[
              styles.description,
              {color: colors.textSecondary},
            ]}>
            בחר את ערכת הנושא של האפליקציה
          </Text>
        </View>

        <View
          style={[
            styles.themeSelector,
            {backgroundColor: colors.surfaceSecondary},
          ]}>
          {themeOptions.map(option => {
            const isSelected = themeMode === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.themeOption,
                  isSelected && {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setThemeMode(option.value)}>
                <Text
                  style={[
                    styles.themeOptionText,
                    {
                      color: isSelected
                        ? colors.primary
                        : colors.textSecondary,
                    },
                    isSelected && styles.themeOptionTextSelected,
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.card,
          styles.accountCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}>
        <Text
          style={[
            styles.sectionTitle,
            {color: colors.textPrimary},
          ]}>
          חשבון
        </Text>

        <View
          style={[
            styles.accountRow,
            {borderTopColor: colors.border},
          ]}>
          <View style={styles.accountTextContainer}>
            <Text
              style={[
                styles.accountTitle,
                {color: colors.textPrimary},
              ]}>
              התנתקות
            </Text>

            <Text
              style={[
                styles.accountDescription,
                {color: colors.textSecondary},
              ]}>
              יציאה מהחשבון במכשיר זה
            </Text>
          </View>

          <Pressable
            style={[
              styles.logoutButton,
              {
                backgroundColor: colors.surfaceSecondary,
              },
              isLoggingOut && styles.logoutButtonDisabled,
            ]}
            disabled={isLoggingOut}
            onPress={handleLogout}>
            {isLoggingOut ? (
              <ActivityIndicator
                size="small"
                color={colors.danger}
              />
            ) : (
              <Text
                style={[
                  styles.logoutText,
                  {color: colors.danger},
                ]}>
                התנתקות
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'right',
  },

  headerDescription: {
    marginTop: 6,
    fontSize: 15,
    textAlign: 'right',
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },

  description: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'right',
  },

  themeSelector: {
    flexDirection: 'row-reverse',
    padding: 4,
    borderRadius: 12,
    gap: 4,
  },

  themeOption: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  themeOptionTextSelected: {
    fontWeight: '800',
  },

  accountCard: {
    marginTop: 16,
  },

  accountRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  accountTextContainer: {
    flex: 1,
  },

  accountTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },

  accountDescription: {
    marginTop: 4,
    fontSize: 13,
    textAlign: 'right',
  },

  logoutButton: {
    minWidth: 88,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  },
});