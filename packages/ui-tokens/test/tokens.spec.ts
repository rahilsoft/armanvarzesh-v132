import * as fs from 'fs';
import * as path from 'path';
import * as T from '../src';
import { contrastRatio } from '../src/contrast';
import { logicalToPhysical, physicalToLogical, logicalSpacing, flipX } from '../src/rtl';
import { generateCss, themeVariables } from '../src/css';

describe('shape', () => {
  it('keeps legacy exports', () => {
    expect(T.colors.primary).toBeDefined();
    expect(T.spacing.md).toBe(12);
    expect(T.radii.lg).toBe(12);
    expect(T.typography.fontSize.base).toBe('16px');
    expect(T.shadows.sm).toBeDefined();
  });
  it('uses 4px-based spacing, Vazirmatn first, RTL default', () => {
    Object.values(T.space).forEach((v) => expect(v % 4).toBe(0));
    expect(T.fontFamilies.primary).toBe('Vazirmatn');
    expect(T.fontFamilies.web.startsWith("'Vazirmatn'")).toBe(true);
    expect(T.direction).toBe('rtl');
    expect(Object.keys(T.themes)).toEqual(['dark', 'light']);
    expect(Object.keys(T.darkTheme).sort()).toEqual(Object.keys(T.lightTheme).sort());
    expect(T.lineHeights.normal).toBeGreaterThanOrEqual(1.6);
  });
  it('z-index and breakpoints ascend', () => {
    const z = Object.values(T.zIndex);
    expect([...z].sort((a, b) => a - b)).toEqual(z);
    const b = Object.values(T.breakpoints);
    expect([...b].sort((a, c) => a - c)).toEqual(b);
  });
});

describe.each(['dark', 'light'] as const)('contrast (%s)', (name) => {
  const t = T.themes[name];
  const bgs = [t.bg, t.surface, t.surfaceRaised];
  it('text and muted text >= 4.5 on all surfaces', () => {
    for (const bg of bgs) {
      expect(contrastRatio(t.text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.textMuted, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('brand and semantic colors >= 4.5 on bg and surface', () => {
    for (const c of [t.primary, t.accent, t.success, t.warning, t.error, t.info]) {
      expect(contrastRatio(c, t.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c, t.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('on-colors >= 4.5 over fills; strong border >= 3', () => {
    expect(contrastRatio(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(t.onAccent, t.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(t.borderStrong, t.bg)).toBeGreaterThanOrEqual(3);
  });
});

describe('rtl', () => {
  it('maps logical edges', () => {
    expect(logicalToPhysical('start')).toBe('right');
    expect(logicalToPhysical('end')).toBe('left');
    expect(logicalToPhysical('start', 'ltr')).toBe('left');
    expect(physicalToLogical('right')).toBe('start');
    expect(physicalToLogical('right', 'ltr')).toBe('end');
    expect(logicalSpacing('margin', { start: 8, end: 4 })).toEqual({ marginRight: 8, marginLeft: 4 });
    expect(flipX()).toBe(-1);
    expect(flipX('ltr')).toBe(1);
  });
});

describe('css', () => {
  it('generates variables', () => {
    const css = generateCss();
    expect(css).toContain('--av-color-primary: #34D399');
    expect(css).toContain("[data-theme='light']");
    expect(css).toContain('--av-space-1: 4px');
    expect(css).toContain('direction: rtl');
    expect(themeVariables(T.darkTheme)['--av-color-surface-raised']).toBe(T.darkTheme.surfaceRaised);
  });
  it('styles/theme.css is in sync with generator', () => {
    const file = path.join(__dirname, '../styles/theme.css');
    expect(fs.readFileSync(file, 'utf8')).toBe(generateCss());
  });
});
