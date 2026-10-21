/** Semantic color themes (dark-first, emerald primary / cyan accent). */
export interface Theme {
  bg: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  primary: string;
  onPrimary: string;
  accent: string;
  onAccent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const palette = {
  emerald: { 300: '#6EE7B7', 400: '#34D399', 500: '#10B981', 600: '#059669', 700: '#047857' },
  cyan: { 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490' },
} as const;

export const darkTheme: Theme = {
  bg: '#0B1210',
  surface: '#111B18',
  surfaceRaised: '#17241F',
  text: '#E8F1EE',
  textMuted: '#A3B5AF',
  border: '#2A3D37',
  borderStrong: '#55796E',
  primary: '#34D399',
  onPrimary: '#04130D',
  accent: '#22D3EE',
  onAccent: '#031318',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#38BDF8',
};

export const lightTheme: Theme = {
  bg: '#FFFFFF',
  surface: '#F4F8F7',
  surfaceRaised: '#FFFFFF',
  text: '#0B1210',
  textMuted: '#4B5F58',
  border: '#D5E0DC',
  borderStrong: '#6B857B',
  primary: '#047857',
  onPrimary: '#FFFFFF',
  accent: '#0E7490',
  onAccent: '#FFFFFF',
  success: '#15803D',
  warning: '#B45309',
  error: '#B91C1C',
  info: '#0369A1',
};

export const themes = { dark: darkTheme, light: lightTheme } as const;
export type ThemeName = keyof typeof themes;
