import React, { useRef } from 'react';
import { cx } from '../atoms/cx';
import { formatNumber, toLatinDigits } from '../format';

export interface OtpInputProps {
  /** Current code, Latin digits, at most `length` characters. */
  value: string;
  onChange: (value: string) => void;
  /** Fired once when every cell is filled. */
  onComplete?: (value: string) => void;
  /** Number of cells. Owner rule: 3, 6 or 9 (default 6). */
  length?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

/** Persian, Arabic-Indic and Latin digits all become Latin digits, everything else is dropped. */
export function normalizeOtp(raw: string, length: number): string {
  return toLatinDigits(raw).replace(/\D/g, '').slice(0, length);
}

/**
 * Apply typing or pasting at a cell. Returns the new code and the cell that should get focus.
 * Pasting several digits fills forward from `index`. Clearing a cell removes that digit.
 */
export function applyOtpInput(value: string, index: number, raw: string, length: number): { value: string; focus: number } {
  const digits = normalizeOtp(raw, length);
  if (!digits) {
    // Clearing a cell removes its digit, later digits shift toward the start.
    return { value: value.slice(0, index) + value.slice(index + 1), focus: index };
  }
  const cells = value.padEnd(length, ' ').split('');
  let i = index;
  for (const d of digits) {
    if (i >= length) break;
    cells[i] = d;
    i += 1;
  }
  return { value: cells.join('').replace(/ +$/, ''), focus: Math.min(i, length - 1) };
}

/** Segmented one-time-code field. Always LTR, digits displayed in Persian. */
export const OtpInput: React.FC<OtpInputProps> = ({
  value, onChange, onComplete, length = 6, label = 'کد تایید', error, disabled, autoFocus, id, className,
}) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const code = normalizeOtp(value, length);
  const errId = error && id ? `${id}-err` : undefined;

  const commit = (index: number, raw: string) => {
    const next = applyOtpInput(code, index, raw, length);
    onChange(next.value);
    if (raw) refs.current[next.focus]?.focus();
    if (next.value.length === length && onComplete) onComplete(next.value);
  };

  return (
    <div role="group" aria-label={label} id={id} className={cx('av-otp', error && 'av-otp--error', className)}>
      <div className="av-otp__cells" dir="ltr">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className="av-otp__cell"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            dir="ltr"
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            aria-label={`رقم ${formatNumber(i + 1)} از ${formatNumber(length)}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={errId}
            value={code[i] ? formatNumber(Number(code[i]), { useGrouping: false }) : ''}
            onChange={(e) => commit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !code[i] && i > 0) {
                e.preventDefault();
                onChange(code.slice(0, i - 1));
                refs.current[i - 1]?.focus();
              }
            }}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
      {error && <p id={errId} role="alert" className="av-field__error">{error}</p>}
    </div>
  );
};
