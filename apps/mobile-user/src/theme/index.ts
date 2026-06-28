/**
 * Arman Varzesh brand theme — Persian green + gold on a deep background.
 * Shared across every screen and component for visual consistency.
 */
export const colors = {
  primary: '#1A5C3A',
  primaryLight: '#2ECC71',
  primaryDark: '#0D3D26',
  secondary: '#D4AF37',
  secondaryLight: '#F0CE58',
  background: '#0F1923',
  surface: '#16222E',
  surfaceAlt: '#1E2D3A',
  text: '#F8FAF9',
  textMuted: '#9FB1BD',
  border: '#243441',
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
} as const;

export const theme = { colors, spacing, radius, typography };
export type Theme = typeof theme;
