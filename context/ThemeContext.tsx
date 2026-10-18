import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as NavigationThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { ThemeColors, lightColors, darkColors } from "@/colors/Colors";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleDark: () => void;
};

const STORAGE_KEY = "themeMode";

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: "system",
  setMode: () => {},
  toggleDark: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") setModeState(saved);
      })
      .catch(() => {});
  }, []);

  const isDark = mode === "system" ? system === "dark" : mode === "dark";

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggleDark = useCallback(() => setMode(isDark ? "light" : "dark"), [isDark, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: isDark ? darkColors : lightColors, isDark, mode, setMode, toggleDark }),
    [isDark, mode, setMode, toggleDark]
  );

  // Keep React Navigation's own surfaces (card backgrounds, transitions) in step with the app theme.
  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    const c = value.colors;
    return {
      ...base,
      colors: { ...base.colors, primary: c.primary, background: c.background, card: c.surface, text: c.text, border: c.border },
    };
  }, [isDark, value.colors]);

  return (
    <ThemeContext.Provider value={value}>
      <NavigationThemeProvider value={navTheme}>{children}</NavigationThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
