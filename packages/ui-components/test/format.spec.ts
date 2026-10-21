import { toPersianDigits, toLatinDigits, formatNumber, formatToman, formatJalali } from '../src';

describe('format', () => {
  it('toPersianDigits converts latin and arabic-indic digits', () => {
    expect(toPersianDigits('0912 123')).toBe('۰۹۱۲ ۱۲۳');
    expect(toPersianDigits(2026)).toBe('۲۰۲۶');
    expect(toPersianDigits('٠١٢')).toBe('۰۱۲');
    expect(toPersianDigits(null)).toBe('');
    expect(toPersianDigits(undefined)).toBe('');
  });
  it('toLatinDigits is the inverse', () => {
    expect(toLatinDigits('۰۹۱۲')).toBe('0912');
    expect(toLatinDigits('٣٤')).toBe('34');
    expect(toLatinDigits(null)).toBe('');
  });
  it('formatNumber and formatToman', () => {
    expect(toLatinDigits(formatNumber(1234567)).replace(/\D/g, '')).toBe('1234567');
    expect(formatNumber(1234567)).toMatch(/^[۰-۹]{1,3}(٬[۰-۹]{3}){2}$/);
    expect(formatToman(120000)).toMatch(/^[۰-۹٬]+ تومان$/);
    expect(formatNumber(NaN)).toBe('');
    expect(formatToman(Infinity)).toBe('');
  });
  it('formatJalali converts Gregorian to Persian calendar', () => {
    const d = new Date('2026-10-21T12:00:00Z');
    expect(formatJalali(d, 'short')).toBe('۱۴۰۵/۰۷/۲۹');
    expect(formatJalali(d)).toBe('۲۹ مهر ۱۴۰۵');
    expect(formatJalali(d, 'long')).toContain('چهارشنبه');
    expect(formatJalali(d, 'full')).toMatch(/۱۵:۳۰|۱۶:۳۰/);
    expect(formatJalali(d.getTime(), 'short')).toBe('۱۴۰۵/۰۷/۲۹');
    expect(formatJalali('nope')).toBe('');
  });
});
