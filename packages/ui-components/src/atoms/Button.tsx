import React from 'react';
import { cx } from './cx';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 'solid' is a deprecated alias of 'primary'. */
  variant?: ButtonVariant | 'solid';
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  const v = variant === 'solid' ? 'primary' : variant;
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx('av-btn', `av-btn--${v}`, `av-btn--${size}`, fullWidth && 'av-btn--block', className)}
      {...rest}
    >
      {loading && <Spinner size="sm" label="در حال انجام" />}
      <span className="av-btn__label">{children}</span>
    </button>
  );
});
