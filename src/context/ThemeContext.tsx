import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {useColorScheme} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DarkColors,
  LightColors,
  ThemeColors,
} from '../constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

const THEME_STORAGE_KEY = 'themeMode';

export function ThemeProvider({children}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();

  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(
          THEME_STORAGE_KEY,
        );

        if (
          storedTheme === 'light' ||
          storedTheme === 'dark' ||
          storedTheme === 'system'
        ) {
          setThemeModeState(storedTheme);
        }
      } catch (error) {
        console.log('Load theme error:', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);

    AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      mode,
    ).catch(error => {
      console.log('Save theme error:', error);
    });
  };

  const resolvedTheme: ResolvedTheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const colors = resolvedTheme === 'dark' ? DarkColors : LightColors;

  const value = useMemo(
    () => ({
      themeMode,
      resolvedTheme,
      colors,
      setThemeMode,
    }),
    [themeMode, resolvedTheme, colors],
  );

  if (!isThemeReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}