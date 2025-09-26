import { assertDefined, optional } from '../../nulls';
describe('nulls utils', () => {
  it('assertDefined throws on null/undefined', () => { expect(() => assertDefined(null)).toThrow(/not defined/); expect(() => assertDefined(undefined)).toThrow(/not defined/); expect(assertDefined(0)).toBe(0); });
  it('optional returns fallback', () => { expect(optional(undefined, 5)).toBe(5); expect(optional(null as any, 'x')).toBe('x'); expect(optional('a', 'x')).toBe('a'); });
});
