import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { themes, contrastRatio } from '@arman/ui-tokens';
import {
  Button, Input, TextField, Badge, Avatar, Card, ProgressBar, XPBar, Spinner, Table,
  initialsOf, clampPercent,
} from '../src';

describe('Button', () => {
  it('renders each variant and size with a 44px-class touch target', () => {
    for (const v of ['primary', 'secondary', 'accent', 'ghost', 'danger', 'link'] as const) {
      expect(html(<Button variant={v}>برو</Button>)).toContain(`av-btn--${v}`);
    }
    for (const s of ['sm', 'md', 'lg'] as const) expect(html(<Button size={s}>x</Button>)).toContain(`av-btn--${s}`);
  });
  it('defaults to type=button and maps legacy solid to primary', () => {
    const out = html(<Button variant="solid">x</Button>);
    expect(out).toContain('type="button"');
    expect(out).toContain('av-btn--primary');
  });
  it('loading disables, sets aria-busy and shows a status spinner', () => {
    const out = html(<Button loading>ذخیره</Button>);
    expect(out).toContain('disabled=""');
    expect(out).toContain('aria-busy="true"');
    expect(out).toContain('role="status"');
  });
  it('disabled and fullWidth', () => {
    const out = html(<Button disabled fullWidth>x</Button>);
    expect(out).toContain('disabled=""');
    expect(out).toContain('av-btn--block');
    expect(out).not.toContain('aria-busy');
  });
});

describe('Input / TextField', () => {
  it('links label, hint and defaults to rtl', () => {
    const out = html(<Input id="p" label="شماره موبایل" hint="مثلا ۰۹۱۲۱۲۳۴۵۶۷" />);
    expect(out).toContain('for="p"');
    expect(out).toContain('dir="rtl"');
    expect(out).toContain('aria-describedby="p-hint"');
    expect(out).not.toContain('aria-invalid');
  });
  it('error replaces hint, sets aria-invalid and role=alert', () => {
    const out = html(<Input id="p" label="x" hint="راهنما" error="شماره نامعتبر است" />);
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('role="alert"');
    expect(out).toContain('aria-describedby="p-err"');
    expect(out).not.toContain('راهنما');
  });
  it('supports ltr override, required marker and generated id', () => {
    const out = html(<TextField label="ایمیل" dir="ltr" required />);
    expect(out).toContain('dir="ltr"');
    expect(out).toContain('required=""');
    expect(out).toMatch(/for="av-in-[^"]+"/);
  });
});

describe('Badge', () => {
  it('tones and solid', () => {
    for (const t of ['neutral', 'success', 'warning', 'error', 'info', 'accent'] as const) {
      expect(html(<Badge tone={t}>x</Badge>)).toContain(`av-badge--${t}`);
    }
    expect(html(<Badge solid>x</Badge>)).toContain('av-badge--solid');
  });
});

describe('Avatar', () => {
  it('shows image with alt', () => {
    const out = html(<Avatar name="علی رضایی" src="/a.png" />);
    expect(out).toContain('<img');
    expect(out).toContain('alt="علی رضایی"');
  });
  it('falls back to initials', () => {
    const out = html(<Avatar name="علی رضایی" size="lg" />);
    expect(out).toContain('role="img"');
    expect(out).toContain('av-avatar--lg');
    expect(out).toContain('ع‌ر');
  });
  it('initialsOf handles ZWNJ, single word and empty', () => {
    expect(initialsOf('نیم‌فاصله تست')).toBe('ن‌ت');
    expect(initialsOf('سارا')).toBe('س');
    expect(initialsOf('  ')).toBe('');
  });
});

describe('Card', () => {
  it('title and variants', () => {
    const out = html(<Card title="امروز" variant="raised">محتوا</Card>);
    expect(out).toContain('<h3');
    expect(out).toContain('av-card--raised');
    expect(html(<Card>x</Card>)).toContain('av-card--outlined');
    expect(html(<Card>x</Card>)).not.toContain('<h3');
  });
});

describe('ProgressBar', () => {
  it('exposes progressbar semantics with Persian valuetext', () => {
    const out = html(<ProgressBar value={25} label="پیشرفت" showValue />);
    expect(out).toContain('role="progressbar"');
    expect(out).toContain('aria-label="پیشرفت"');
    expect(out).toContain('aria-valuenow="25"');
    expect(out).toContain('aria-valuetext="۲۵٪"');
    expect(out).toContain('width:25%');
  });
  it('clamps', () => {
    expect(clampPercent(150, 100)).toBe(100);
    expect(clampPercent(-5, 100)).toBe(0);
    expect(clampPercent(5, 0)).toBe(0);
    expect(clampPercent(NaN, 10)).toBe(0);
    expect(html(<ProgressBar value={500} max={100} label="x" />)).toContain('aria-valuenow="100"');
  });
});

describe('XPBar', () => {
  it('shows level, xp and remaining in Persian digits', () => {
    const out = html(<XPBar level={5} xp={120} xpToNext={300} />);
    expect(out).toContain('سطح ۵');
    expect(out).toContain('۱۲۰ از ۳۰۰ امتیاز');
    expect(out).toContain('۱۸۰ امتیاز تا سطح ۶');
    expect(out).toContain('role="progressbar"');
    expect(out).toContain('width:40%');
  });
  it('level complete', () => {
    expect(html(<XPBar level={5} xp={300} xpToNext={300} />)).toContain('سطح ۶ باز شد');
  });
});

describe('Spinner', () => {
  it('has status role and label', () => {
    const out = html(<Spinner size="lg" />);
    expect(out).toContain('role="status"');
    expect(out).toContain('در حال بارگذاری');
    expect(out).toContain('av-spinner--lg');
    expect(html(<Spinner label="لطفا صبر کنید" />)).toContain('لطفا صبر کنید');
  });
});

describe('Table (legacy)', () => {
  it('renders rows', () => {
    const out = html(<Table data={[{ a: 'x' }]} columns={[{ key: 'a', header: 'ستون' }]} />);
    expect(out).toContain('scope="col"');
    expect(out).toContain('<td>x</td>');
  });
});

describe('WCAG AA with tokens (CSS pairs)', () => {
  const pairs = (t: typeof themes.dark) => [
    ['primary button', t.onPrimary, t.primary],
    ['accent button', t.onAccent, t.accent],
    ['danger button', t.onPrimary, t.error],
    ['body on surface', t.text, t.surface],
    ['muted on surface', t.textMuted, t.surface],
    ['ghost/link on bg', t.primary, t.bg],
    ['error text on surface', t.error, t.surface],
    ['badge success', t.success, t.surface],
    ['badge warning', t.warning, t.surface],
    ['badge error', t.error, t.surface],
    ['badge info', t.info, t.surface],
    ['badge accent', t.accent, t.surface],
    ['solid badge warning', t.onPrimary, t.warning],
    ['solid badge info', t.onPrimary, t.info],
    ['solid badge success', t.onPrimary, t.success],
    ['solid badge neutral', t.onPrimary, t.textMuted],
    ['focus ring vs bg (3:1)', t.accent, t.bg, 3],
    ['input border vs surface (3:1)', t.textMuted, t.surface, 3],
  ] as Array<[string, string, string, number?]>;
  for (const name of ['dark', 'light'] as const) {
    it.each(pairs(themes[name]))(`${name}: %s`, (_n, fg, bg, min = 4.5) => {
      expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
    });
  }
});
