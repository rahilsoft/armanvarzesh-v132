import React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { themes, contrastRatio } from '@arman/ui-tokens';
import {
  OtpInput, ListRow, TabBar, StatTile, Sheet, Skeleton, EmptyState, LevelBadge,
  normalizeOtp, applyOtpInput, isOwnerCount, nextTabIndex, sheetKeyHandler, tierOf,
} from '../src';

const noop = () => undefined;

describe('OtpInput', () => {
  it('renders 6 cells by default inside a labelled group, LTR, numeric', () => {
    const out = html(<OtpInput value="" onChange={noop} />);
    expect(out).toContain('role="group"');
    expect(out).toContain('aria-label="کد تایید"');
    expect(out.match(/<input/g)).toHaveLength(6);
    expect(out).toContain('inputMode="numeric"');
    expect(out).toContain('autoComplete="one-time-code"');
    expect(out).toContain('aria-label="رقم ۱ از ۶"');
    expect(out).toContain('dir="ltr"');
  });
  it('supports 3 and 9 cells', () => {
    expect(html(<OtpInput value="" onChange={noop} length={3} />).match(/<input/g)).toHaveLength(3);
    expect(html(<OtpInput value="" onChange={noop} length={9} />).match(/<input/g)).toHaveLength(9);
  });
  it('shows filled digits in Persian', () => {
    const out = html(<OtpInput value="123" onChange={noop} />);
    expect(out).toContain('value="۱"');
    expect(out).toContain('value="۳"');
  });
  it('normalises Persian, Arabic-Indic and Latin digits and drops junk', () => {
    expect(normalizeOtp('۱۲۳۴۵۶', 6)).toBe('123456');
    expect(normalizeOtp('٤٥٦', 6)).toBe('456');
    expect(normalizeOtp('1a2-3', 6)).toBe('123');
    expect(normalizeOtp('1234567890', 6)).toBe('123456');
  });
  it('typing, pasting and clearing', () => {
    expect(applyOtpInput('', 0, '۷', 6)).toEqual({ value: '7', focus: 1 });
    expect(applyOtpInput('12', 2, '345678', 6)).toEqual({ value: '123456', focus: 5 });
    expect(applyOtpInput('123456', 2, '', 6)).toEqual({ value: '12456', focus: 2 });
    expect(applyOtpInput('12', 1, '', 6).value).toBe('1');
  });
  it('error is announced and linked', () => {
    const out = html(<OtpInput id="o" value="" onChange={noop} error="کد اشتباه است" />);
    expect(out).toContain('role="alert"');
    expect(out).toContain('aria-invalid="true"');
    expect(out).toContain('aria-describedby="o-err"');
  });
});

describe('ListRow', () => {
  it('drops unsafe href schemes and keeps safe ones', () => {
    for (const bad of ['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', '//evil.com', '/\\evil.com', 'vbscript:x']) {
      const out = html(<ListRow title="x" href={bad} />);
      expect(out).not.toContain('href=');
      expect(out).not.toContain('<a ');
    }
    for (const ok of ['/wallet', '#top', 'https://a.com', 'http://a.com', 'mailto:a@b.com', 'tel:+98912']) {
      expect(html(<ListRow title="x" href={ok} />)).toContain('href="' + ok + '"');
    }
  });
  it('plain row has no chevron', () => {
    const out = html(<ListRow title="پروفایل" subtitle="ویرایش" trailing="۳" />);
    expect(out).toContain('<div');
    expect(out).not.toContain('av-row__chevron');
    expect(out).toContain('پروفایل');
  });
  it('button and link variants show chevron', () => {
    const b = html(<ListRow title="x" onClick={noop} />);
    expect(b).toContain('<button');
    expect(b).toContain('type="button"');
    expect(b).toContain('av-row__chevron');
    const a = html(<ListRow title="x" href="/wallet" />);
    expect(a).toContain('<a ');
    expect(a).toContain('href="/wallet"');
  });
  it('disabled button', () => {
    expect(html(<ListRow title="x" onClick={noop} disabled />)).toContain('disabled=""');
  });
});

describe('TabBar', () => {
  const tabs = ['a', 'b', 'c'].map((id) => ({ id, label: id }));
  it('roving tabindex and aria-selected', () => {
    const out = html(<TabBar tabs={tabs} activeId="b" onChange={noop} />);
    expect(out).toContain('role="tablist"');
    expect(out.match(/role="tab"/g)).toHaveLength(3);
    expect(out.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(out.match(/tabindex="0"/g)).toHaveLength(1);
    expect(out.match(/tabindex="-1"/g)).toHaveLength(2);
    expect(out).toContain('dir="rtl"');
  });
  it('3/6/9 owner rule', () => {
    for (const n of [3, 6, 9, 12, 15, 18]) expect(isOwnerCount(n)).toBe(true);
    for (const n of [0, 1, 2, 4, 5, 7, 8, 10]) expect(isOwnerCount(n)).toBe(false);
  });
  it('arrow keys follow RTL', () => {
    expect(nextTabIndex('ArrowLeft', 0, 3, 'rtl')).toBe(1);
    expect(nextTabIndex('ArrowRight', 0, 3, 'rtl')).toBe(2);
    expect(nextTabIndex('ArrowRight', 0, 3, 'ltr')).toBe(1);
    expect(nextTabIndex('Home', 2, 3)).toBe(0);
    expect(nextTabIndex('End', 0, 3)).toBe(2);
    expect(nextTabIndex('x', 0, 3)).toBeNull();
  });
});

describe('StatTile', () => {
  it('formats number with Persian digits and unit', () => {
    const out = html(<StatTile label="کالری" value={1250} unit="کیلوکالری" />);
    expect(out).toContain('۱٬۲۵۰');
    expect(out).toContain('کیلوکالری');
    expect(out).not.toContain('av-stat__delta');
  });
  it('delta shows sign, arrow and trend class', () => {
    const up = html(<StatTile label="x" value="۱" delta={12} deltaLabel="نسبت به هفته قبل" />);
    expect(up).toContain('av-stat__delta--up');
    expect(up).toContain('+۱۲');
    expect(up).toContain('▲');
    const down = html(<StatTile label="x" value="۱" delta={-3} />);
    expect(down).toContain('av-stat__delta--down');
    expect(down).toContain('−۳');
    expect(html(<StatTile label="x" value="۱" delta={0} />)).toContain('av-stat__delta--flat');
  });
});

describe('Sheet', () => {
  it('closed renders nothing', () => {
    expect(html(<Sheet open={false} onClose={noop} title="t" />)).toBe('');
  });
  it('open is a modal dialog labelled by its title', () => {
    const out = html(<Sheet open onClose={noop} title="فیلتر" footer={<b>ok</b>}>بدنه</Sheet>);
    expect(out).toContain('role="dialog"');
    expect(out).toContain('aria-modal="true"');
    expect(out).toMatch(/aria-labelledby="av-sheet-[^"]+"/);
    expect(out).toContain('<h2');
    expect(out).toContain('aria-label="بستن"');
    expect(out).toContain('بدنه');
    expect(out).toContain('av-sheet__footer');
  });
  it('Escape closes, other keys do not', () => {
    const close = jest.fn();
    const h = sheetKeyHandler(close);
    h({ key: 'Enter' });
    expect(close).not.toHaveBeenCalled();
    h({ key: 'Escape' });
    expect(close).toHaveBeenCalledTimes(1);
  });
});

describe('Skeleton', () => {
  it('text draws 3 lines by default with a hidden status label', () => {
    const out = html(<Skeleton />);
    expect(out).toContain('role="status"');
    expect(out).toContain('aria-busy="true"');
    expect(out.match(/av-skeleton__block--text/g)).toHaveLength(3);
    expect(out).toContain('inline-size:60%');
  });
  it('variants and size', () => {
    expect(html(<Skeleton variant="circle" width={44} height={44} />)).toContain('av-skeleton__block--circle');
    expect(html(<Skeleton variant="rect" lines={9} />).match(/av-skeleton__block--rect/g)).toHaveLength(1);
  });
});

describe('EmptyState', () => {
  it('title, description and action', () => {
    const out = html(<EmptyState title="تمرینی ثبت نشده" description="اولین تمرین را شروع کن." icon="🏋" action={<button>شروع</button>} />);
    expect(out).toContain('<h2');
    expect(out).toContain('av-empty__desc');
    expect(out).toContain('av-empty__action');
    expect(out).not.toContain('role="alert"');
  });
  it('error tone alerts and heading level is configurable', () => {
    const out = html(<EmptyState tone="error" title="مشکلی پیش آمد" headingLevel={3} />);
    expect(out).toContain('role="alert"');
    expect(out).toContain('<h3');
  });
});

describe('LevelBadge', () => {
  it('tiers', () => {
    expect(tierOf(1)).toBe('bronze');
    expect(tierOf(9)).toBe('bronze');
    expect(tierOf(10)).toBe('silver');
    expect(tierOf(24)).toBe('silver');
    expect(tierOf(25)).toBe('gold');
  });
  it('is an image with a Persian label including tier', () => {
    const out = html(<LevelBadge level={12} rank="پیشرفته" />);
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="سطح ۱۲، پیشرفته، نقره‌ای"');
    expect(out).toContain('av-level--silver');
    expect(out).toContain('>۱۲<');
  });
  it('clamps below 1 and supports sizes', () => {
    expect(html(<LevelBadge level={0} size="lg" />)).toContain('سطح ۱،');
    expect(html(<LevelBadge level={3} size="sm" />)).toContain('av-level--sm');
  });
  it('tier text contrast >= 4.5 in both themes', () => {
    for (const t of [themes.dark, themes.light]) {
      expect(contrastRatio(t.onPrimary, t.warning)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.onAccent, t.accent)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
