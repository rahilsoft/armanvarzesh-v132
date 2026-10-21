import React from 'react';
import { cx } from './cx';
import { formatNumber } from '../format';

export interface ProgressBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number;
  max?: number;
  /** Accessible name (required for screen readers). */
  label: string;
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  /** Show the percentage as Persian text next to the bar. */
  showValue?: boolean;
}

export function clampPercent(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

/** The fill grows from the inline start edge, so in RTL it fills right to left. */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, label, tone = 'primary', showValue = false, className, ...rest }) => {
  const pct = clampPercent(value, max);
  const text = `${formatNumber(Math.round(pct))}٪`;
  return (
    <div className={cx('av-progress', className)} {...rest}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(max, Math.max(0, value))}
        aria-valuetext={text}
        className="av-progress__track"
      >
        <div className={cx('av-progress__fill', `av-progress__fill--${tone}`)} style={{ width: `${pct}%` }} />
      </div>
      {showValue && <span className="av-progress__value" aria-hidden="true">{text}</span>}
    </div>
  );
};
