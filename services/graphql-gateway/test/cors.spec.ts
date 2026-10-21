import { corsOriginCheck } from '../src/cors';

const run = (check: ReturnType<typeof corsOriginCheck>, origin?: string) => {
  let res: any;
  check(origin, (err, allow) => { res = { err, allow }; });
  return res;
};

describe('GraphQL Gateway - CORS allowlist', () => {
  it('allows requests without Origin', () => {
    expect(run(corsOriginCheck({} as any)).allow).toBe(true);
  });
  it('allows listed origins only', () => {
    const c = corsOriginCheck({ CORS_ORIGINS: 'https://app.ir,https://admin.ir' } as any);
    expect(run(c, 'https://admin.ir').allow).toBe(true);
    expect(run(c, 'https://evil.com').err).toBeInstanceOf(Error);
  });
  it('denies every browser origin when allowlist is empty', () => {
    expect(run(corsOriginCheck({} as any), 'https://any.com').err).toBeInstanceOf(Error);
  });
});
