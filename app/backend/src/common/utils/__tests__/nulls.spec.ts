import { assertDefined, isNonNullish, coalesce, requireEnv } from '../nulls';

// Rewritten to test the real exported API: the previous stub imported a
// function that never existed (`optional`) and asserted a throw message the
// implementation never used.
describe('nulls utils', () => {
  it('assertDefined throws on null/undefined and narrows otherwise', () => {
    expect(() => assertDefined(null)).toThrow(/is required/);
    expect(() => assertDefined(undefined, 'thing')).toThrow(/thing is required/);
    const v: number | null = 0;
    assertDefined(v); // must not throw for falsy-but-defined values
    expect(v).toBe(0);
  });

  it('isNonNullish accepts falsy-but-defined values', () => {
    expect(isNonNullish(0)).toBe(true);
    expect(isNonNullish('')).toBe(true);
    expect(isNonNullish(null)).toBe(false);
    expect(isNonNullish(undefined)).toBe(false);
  });

  it('coalesce returns the first defined value', () => {
    expect(coalesce(undefined, null, 5, 7)).toBe(5);
    expect(coalesce<string>(undefined, null)).toBeUndefined();
    expect(coalesce('a', 'x')).toBe('a');
  });

  it('requireEnv returns the value or throws when missing', () => {
    process.env.__NULLS_SPEC_PROBE = 'set';
    expect(requireEnv('__NULLS_SPEC_PROBE')).toBe('set');
    delete process.env.__NULLS_SPEC_PROBE;
    expect(() => requireEnv('__NULLS_SPEC_PROBE')).toThrow(/Missing required env/);
  });
});
