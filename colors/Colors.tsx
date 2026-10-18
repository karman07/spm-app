import { Platform, ViewStyle } from "react-native";

// Brand green. Imported all over the app, so changing it re-themes headers, buttons and accents.
export const BASE_COLOR = "#0B6B3A";

export type ThemeColors = {
  primary: string; // accent for text, icons and borders
  button: string; // filled button / active surface behind white text
  primaryDark: string;
  primarySoft: string;
  header: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
  dangerSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  inputPlaceholder: string;
};

export const lightColors: ThemeColors = {
  primary: BASE_COLOR,
  button: BASE_COLOR,
  primaryDark: "#064826",
  primarySoft: "#E5F3EA",
  header: BASE_COLOR,
  background: "#F4F7F5",
  surface: "#FFFFFF",
  text: "#14231B",
  textMuted: "#66756C",
  border: "#DCE4DF",
  danger: "#D64545",
  dangerSoft: "#FDECEC",
  success: "#1E9E5A",
  successSoft: "#E3F6EB",
  warning: "#F2A33A",
  inputPlaceholder: "#9AA7A0",
};

export const darkColors: ThemeColors = {
  primary: "#4CD08A",
  button: "#1F8A4F",
  primaryDark: "#0F5A33",
  primarySoft: "#1B3427",
  header: "#0F1A14",
  background: "#0C1210",
  surface: "#16201B",
  text: "#E8F0EB",
  textMuted: "#93A39A",
  border: "#2A3A31",
  danger: "#FF7B7B",
  dangerSoft: "#3A1F1F",
  success: "#3DDC84",
  successSoft: "#17382A",
  warning: "#F2B25B",
  inputPlaceholder: "#6E7F75",
};

// Light palette, for code that sits outside the theme provider. Screens should use useTheme().
export const colors = lightColors;

export const radius = { sm: 8, md: 12, lg: 16, xl: 24 };

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

const shadowBase = (opacity: number, blur: number, y: number): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: "#0B2A1A",
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    default: { elevation: Math.round(blur / 2) },
  }) as ViewStyle;

export const shadow = {
  soft: shadowBase(0.06, 8, 2),
  card: shadowBase(0.1, 16, 6),
  raised: shadowBase(0.18, 20, 10),
};

// Mixes a #RRGGBB colour towards white by `amount` (0-1). Used to keep accent colours readable on dark surfaces.
export const lighten = (hex: string, amount: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
};

// Appends an alpha channel to a #RRGGBB colour, e.g. withAlpha("#0B6B3A", 0.12).
export const withAlpha = (hex: string, alpha: number): string =>
  hex + Math.round(Math.min(Math.max(alpha, 0), 1) * 255).toString(16).padStart(2, "0");
