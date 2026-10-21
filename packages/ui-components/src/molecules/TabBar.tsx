import React, { useRef } from 'react';
import { cx } from '../atoms/cx';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabBarProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Accessible name of the tab list. */
  label?: string;
  dir?: 'rtl' | 'ltr';
  className?: string;
}

/** Owner rule: counts reduce by digit sum to 3, 6 or 9. */
export function isOwnerCount(n: number): boolean {
  if (n < 1) return false;
  let s = n;
  while (s > 9) s = String(s).split('').reduce((a, d) => a + Number(d), 0);
  return s === 3 || s === 6 || s === 9;
}

/** Arrow keys follow the reading direction: in RTL, ArrowLeft moves to the next tab. */
export function nextTabIndex(key: string, index: number, count: number, dir: 'rtl' | 'ltr' = 'rtl'): number | null {
  const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  if (key === forward) return (index + 1) % count;
  if (key === back) return (index - 1 + count) % count;
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  return null;
}

/** Bottom or top tab bar with roving tabindex. Use 3, 6 or 9 tabs. */
export const TabBar: React.FC<TabBarProps> = ({ tabs, activeId, onChange, label = 'ناوبری', dir = 'rtl', className }) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test' && !isOwnerCount(tabs.length)) {
    // eslint-disable-next-line no-console
    console.warn(`TabBar: ${tabs.length} tabs breaks the 3/6/9 design rule.`);
  }
  return (
    <div role="tablist" aria-label={label} aria-orientation="horizontal" dir={dir} className={cx('av-tabs', className)}>
      {tabs.map((t, i) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`av-tab-${t.id}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={cx('av-tab', active && 'av-tab--active')}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => {
              const n = nextTabIndex(e.key, i, tabs.length, dir);
              if (n === null) return;
              e.preventDefault();
              refs.current[n]?.focus();
              onChange(tabs[n].id);
            }}
          >
            {t.icon && <span className="av-tab__icon" aria-hidden="true">{t.icon}</span>}
            <span className="av-tab__label">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
