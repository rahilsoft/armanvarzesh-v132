import React from 'react';
import { cx } from './cx';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** Accessible name announced to screen readers. */
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'در حال بارگذاری', className, ...rest }) => (
  <span role="status" aria-live="polite" className={cx('av-spinner', `av-spinner--${size}`, className)} {...rest}>
    <span className="av-spinner__ring" aria-hidden="true" />
    <span className="av-visually-hidden">{label}</span>
  </span>
);
