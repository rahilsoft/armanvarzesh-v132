import { signPreview, verifyPreview } from './preview.util';

const SECRET = 'preview-secret';

describe('preview token', () => {
  it('round-trips a payload', () => {
    const token = signPreview({ id: 'abc' }, SECRET);
    expect(verifyPreview(token, SECRET)).toMatchObject({ id: 'abc' });
  });

  it('rejects a token signed with another secret', () => {
    const token = signPreview({ id: 'abc' }, 'other-secret');
    expect(verifyPreview(token, SECRET)).toBe(false);
  });

  it('rejects a tampered payload', () => {
    const token = signPreview({ id: 'abc', role: 'viewer' }, SECRET);
    const [, sig] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ id: 'abc', role: 'admin' })).toString('base64url');
    expect(verifyPreview(`${forged}.${sig}`, SECRET)).toBe(false);
  });

  // Regression: timingSafeEqual throws RangeError on a length mismatch, so a
  // truncated signature crashed the caller instead of being rejected.
  it('rejects a truncated signature without throwing', () => {
    const token = signPreview({ id: 'abc' }, SECRET);
    const [body, sig] = token.split('.');
    expect(() => verifyPreview(`${body}.${sig.slice(0, 5)}`, SECRET)).not.toThrow();
    expect(verifyPreview(`${body}.${sig.slice(0, 5)}`, SECRET)).toBe(false);
  });

  it('rejects an over-long signature without throwing', () => {
    const token = signPreview({ id: 'abc' }, SECRET);
    const [body, sig] = token.split('.');
    expect(verifyPreview(`${body}.${sig}extra`, SECRET)).toBe(false);
  });

  it('rejects a malformed token', () => {
    expect(verifyPreview('', SECRET)).toBe(false);
    expect(verifyPreview('nodot', SECRET)).toBe(false);
    expect(verifyPreview('.', SECRET)).toBe(false);
  });

  it('rejects an expired token and accepts an unexpired one', () => {
    const expired = signPreview({ id: 'a', exp: Date.now() - 1000 }, SECRET);
    expect(verifyPreview(expired, SECRET)).toBe(false);

    const live = signPreview({ id: 'a', exp: Date.now() + 60_000 }, SECRET);
    expect(verifyPreview(live, SECRET)).toMatchObject({ id: 'a' });
  });
});
