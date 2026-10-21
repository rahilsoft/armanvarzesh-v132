/** Persian formatting helpers (no dependencies, Intl only). */
const FA = '۰۱۲۳۴۵۶۷۸۹';
const AR = '٠١٢٣٤٥٦٧٨٩';

/** Replace Latin and Arabic-Indic digits with Persian digits. Null and undefined give an empty string. */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/[0-9]/g, (d) => FA[+d])
    .replace(/[٠-٩]/g, (d) => FA[AR.indexOf(d)]);
}

/** Inverse of toPersianDigits, useful for parsing user input. */
export function toLatinDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  return String(input)
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR.indexOf(d)));
}

/** Persian number with thousands separator, e.g. ۱٬۲۳۴٬۵۶۷. */
export function formatNumber(n: number, opts: Intl.NumberFormatOptions = {}): string {
  if (!Number.isFinite(n)) return '';
  return new Intl.NumberFormat('fa-IR', opts).format(n);
}

/** Money in Toman, e.g. ۱۲۰٬۰۰۰ تومان. */
export function formatToman(n: number): string {
  const s = formatNumber(n);
  return s ? `${s} تومان` : '';
}

export type JalaliStyle = 'short' | 'medium' | 'long' | 'full';

/**
 * Jalali (Persian calendar) date. short ۱۴۰۵/۰۸/۳۰, medium ۳۰ آبان ۱۴۰۵,
 * long adds the weekday, full adds the time.
 */
export function formatJalali(date: Date | number | string, style: JalaliStyle = 'medium', timeZone = 'Asia/Tehran'): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const locale = 'fa-IR-u-ca-persian';
  const opts: Record<JalaliStyle, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };
  return new Intl.DateTimeFormat(locale, { ...opts[style], timeZone }).format(d);
}
