import { liveCorsOrigins } from '../../src/livekit/live.gateway';

describe('liveCorsOrigins', () => {
  it('denies cross-origin when no allowlist is configured', () => {
    expect(liveCorsOrigins({} as any)).toBe(false);
  });
  it('parses CORS_ORIGINS, falling back to CORS_ORIGIN and ALLOWED_ORIGINS', () => {
    expect(liveCorsOrigins({ CORS_ORIGINS: 'https://a.ir, https://b.ir' } as any)).toEqual(['https://a.ir', 'https://b.ir']);
    expect(liveCorsOrigins({ CORS_ORIGIN: 'https://c.ir' } as any)).toEqual(['https://c.ir']);
    expect(liveCorsOrigins({ ALLOWED_ORIGINS: 'https://d.ir' } as any)).toEqual(['https://d.ir']);
  });
});
