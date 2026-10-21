import React, { useId } from 'react';
import { cx } from './cx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  /** Direction of the typed value. Phone, OTP and email fields pass 'ltr'. */
  dir?: 'rtl' | 'ltr' | 'auto';
}

/** Text field with label, hint and error. Direction defaults to RTL. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, dir = 'rtl', required, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `av-in-${auto}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;
  const described = [describedBy, error ? errId : hintId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cx('av-field', error && 'av-field--error')}>
      {label && (
        <label className="av-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="av-field__req" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        dir={dir}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={described}
        className={cx('av-input', className)}
        {...rest}
      />
      {hint && !error && <p id={hintId} className="av-field__hint">{hint}</p>}
      {error && <p id={errId} role="alert" className="av-field__error">{error}</p>}
    </div>
  );
});

export const TextField = Input;
