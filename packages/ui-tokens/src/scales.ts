/** Numeric scales (unitless numbers: px for web, dp for React Native). */
export const fontFamilies = {
  primary: 'Vazirmatn',
  web: "'Vazirmatn', 'Vazir', 'Yekan', Tahoma, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

export const fontSizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 } as const;
export const fontWeights = { regular: 400, medium: 500, semibold: 600, bold: 700 } as const;
/** Persian script needs taller lines than Latin for diacritics. */
export const lineHeights = { tight: 1.4, normal: 1.7, relaxed: 1.9 } as const;

export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 } as const;
export const radius = { none: 0, xs: 4, sm: 6, md: 8, lg: 12, xl: 16, '2xl': 24, full: 9999 } as const;

export const elevation = {
  0: { css: 'none', rn: { shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 } },
  1: { css: '0 1px 2px rgba(0,0,0,0.30)', rn: { shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } },
  2: { css: '0 4px 12px rgba(0,0,0,0.35)', rn: { shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 } },
  3: { css: '0 8px 24px rgba(0,0,0,0.40)', rn: { shadowOpacity: 0.4, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 } },
} as const;

export const motion = {
  duration: { instant: 0, fast: 120, normal: 200, slow: 320, slower: 500 },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
  },
  /** Bezier control points for RN Easing.bezier(...). */
  easingPoints: {
    standard: [0.2, 0, 0, 1],
    accelerate: [0.3, 0, 1, 1],
    decelerate: [0, 0, 0, 1],
  },
} as const;

export const zIndex = { base: 0, dropdown: 1000, sticky: 1100, overlay: 1200, modal: 1300, popover: 1400, toast: 1500, tooltip: 1600 } as const;
export const breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;
