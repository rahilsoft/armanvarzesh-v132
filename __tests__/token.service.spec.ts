const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiQCM03t0mgklY
+bgnVXgVMbIloJ3SPxspsagiG2UGoHtrKCChA7T/PPvqUH0l5o0VVA2ccO8ozXfJ
ywTnFULA+kjsGHeJKdv4eoPt/3f89f6vqf4XjJ5i7F+lyM5nF+K8d4cJ+U6NZ8uy
ij3AXkRPuwuw6M4+QWcCqK+EMPbPxFdl/08hUiu0oL2S+8vjArn1TItXoM+KH6UG
tDrKeyu6O0BkFFGzvY0Aq/9AOoM9xW9btRtKVCxADadXgVRRQdUoyRBFSv6pPAqC
4UVS+sK/LwWD05Y6s1vXrxa/Ee8iNrZoZbhUMYPSUDsd8CP0QRMGww1e1V1BYAXm
K2nFS6XLAgMBAAECggEAQsit28BhRSm2HuZvfmTTMmZd8I9tpo7sJK2FNLQjaQZc
B/BrWTvv5FuK/MpPdq2MPZx2/BO19LRZxJ4Bz3hOIQqAFfjO6BUMElePs+Px9iBi
0lV6ZFcktYySWyxgCLxbOEiL+ty1XDYkQYpe2fa5cVOECu9dWbESiA1k6b9OS1ta
YDx58eFsONFWs8sBW2HC9Ych+2I8xGvNL/j550VXuFzHUvpAPw9fLdLAIofASt+4
e5T/BXdLObFGh56bRWX2P/Yu1i1RlecTbwq1CLU+uqwdK086E3Ozcr5anl85zDat
/KB/MTd1lb27IRHqV7BdTkv5Vi5dHqtIB/ksLwh7gQKBgQDxlMPFQrj4t2G7qdvH
Ehfn+vp2RRC0OolotC20RST2iax8X1DYo4jViqIFoNiFzLYm86yTsLWpvuDRe21t
RpD3WUevbNtbuoUfEjOoyq5Qru/lVm3nZ64LEFgfQPTxw6eLegojKEIe0myLN35c
rgfxKrtxgwBaalXfYDy2N95LiwKBgQDvwSEmFcN6f9NpwFf3tbv7lGwbDBNd4R7F
DYLciN3nMiphnkovll8B5XcO+kIMBD3Hv1B/hYbW3h6vmnOYOT4tYkw1jePr4p+q
BqMaZyiTyIKryLZZPCZY8BMgqlP8R0aAH6VO7rw8opOZrxasnT/19KB8X9o1NLNG
99RdZnxWwQKBgQDWJRb9D05EOtqJreJCLsm+O341xLcv7AvOIpm5COnhGN0rSpqx
zxUGpeNFtfT5diOpl6tNKAGAvNExIIY5ranneN7QpGA2ibpjdpEQeMnYf5nr45d8
3y0qZYyX986pWNR2EPJXg+JIzCKnrcN3iFVF9Kk/z+5KN6RzZC2tIQ0OTQKBgAY5
98hrbEY0J6NpcV9ngthHxH73U1Fu1UO81BcyHsEwVlVurPKLbzA3a14iNbDmM0yK
tWZ6a0QNRLK+yh277tdy5BPH+ZFYs1jRD09SOoWMAYjAj6vFmiFZKsYAZmn41+Xf
7IUeQhk5B6hIGcil1NFoZvqT6rDTC4zeRs+eJ8CBAoGBAKhmwdUZh0v7wff1cnOV
5yW+RwxUmXPPzwfBCdjethfy0Om+EdbIbcB3spDnWEXFHOgdMI/9CZGyz0614K1y
JOTVY3LT8eacDUm15dN73p82uDiFnC68t35xKAhDFMX4Z1ZiyxRJD1fbGckEnwdw
5ziHekDjKyv8YxDHkP4Yd+XP
-----END PRIVATE KEY-----`;

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4kAjNN7dJoJJWPm4J1V4
FTGyJaCd0j8bKbGoIhtlBqB7ayggoQO0/zz76lB9JeaNFVQNnHDvKM13ycsE5xVC
wPpI7Bh3iSnb+HqD7f93/PX+r6n+F4yeYuxfpcjOZxfivHeHCflOjWfLsoo9wF5E
T7sLsOjOPkFnAqivhDD2z8RXZf9PIVIrtKC9kvvL4wK59UyLV6DPih+lBrQ6ynsr
ujtAZBRRs72NAKv/QDqDPcVvW7UbSlQsQA2nV4FUUUHVKMkQRUr+qTwKguFFUvrC
vy8Fg9OWOrNb168WvxHvIja2aGW4VDGD0lA7HfAj9EETBsMNXtVdQWAF5itpxUul
ywIDAQAB
-----END PUBLIC KEY-----`;

const ORIGINAL_ENV = process.env;

describe('TokenService RS256 configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('signs and verifies tokens using the configured RS256 keys', async () => {
    process.env.JWT_PRIVATE_KEY = PRIVATE_KEY;
    process.env.JWT_PUBLIC_KEY = PUBLIC_KEY;
    process.env.JWT_KID = 'test-kid';
    process.env.JWT_ISSUER = 'issuer';
    process.env.JWT_AUDIENCE = 'aud';
    process.env.JWT_EXPIRES_IN = '60s';

    const { TokenService } = await import('../app/backend/src/common/services/token.service');
    const service = new TokenService();
    const token = service.sign({ sub: 'user-123', role: 'coach' });
    expect(typeof token).toBe('string');

    const decoded: any = service.verify(token);
    expect(decoded.sub).toBe('user-123');
    expect(decoded.role).toBe('coach');
    expect(decoded.iss).toBe('issuer');
    expect(decoded.aud).toBe('aud');
  });

  it('throws when no RS256 private key is configured', async () => {
    process.env.JWT_PRIVATE_KEY = '';
    process.env.JWKS_PRIVATE_PEM = '';

    await expect(async () => {
      const module = await import('../app/backend/src/common/services/token.service');
      // eslint-disable-next-line new-cap
      new module.TokenService();
    }).rejects.toThrow('TokenService requires JWT_PRIVATE_KEY');
  });
});
