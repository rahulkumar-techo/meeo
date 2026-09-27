import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTheme } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  theme: ColorTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const systemScheme = useSystemColorScheme();

  const currentMode = (colorScheme || 'light') as ThemeMode;
  const isDark =
    currentMode === 'dark' || (currentMode === 'system' && systemScheme === 'dark');

  const theme = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const toggleTheme = React.useCallback(() => {
    const nextMode = isDark ? 'light' : 'dark';
    setColorScheme(nextMode);
  }, [isDark, setColorScheme]);

  const handleSetMode = React.useCallback((mode: ThemeMode) => {
    setColorScheme(mode);
  }, [setColorScheme]);

  const contextValue = useMemo(
    () => ({
      isDark,
      theme,
      mode: currentMode,
      setMode: handleSetMode,
      toggleTheme,
    }),
    [isDark, theme, currentMode, handleSetMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback when used outside provider
    return {
      isDark: false,
      theme: lightColors,
      mode: 'light' as ThemeMode,
      setMode: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
