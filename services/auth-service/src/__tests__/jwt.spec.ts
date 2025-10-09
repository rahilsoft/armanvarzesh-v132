import { buildKeyStore } from '../jwt.js';
import { signer } from '../../../../packages/auth-kit/src/jwks';

const PRIVATE_KEY_ONE = `-----BEGIN PRIVATE KEY-----
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

const PRIVATE_KEY_TWO = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCV+C5l2aEJ3dXB
KkC/EdLIhtiWFDmChbNniev+5q8gM+CCU3m5qqckb6xqAxr3WbwYRUX01UcJi4Jr
HZ0xf2U8jFpGvWDM3AYGlyPsQAk1kmMyEB2MhPehj+jOT3AvFpyx41cK8wtgPTn+
gfqIROYHqvlFh3OX+Eml1dl9KbKoi++hdal1VL4s5WWoPspucm9T4f8wODfHB7yz
8sT3GLJ1OwIeIc/amudkx+nKguTQijpVE/4fSl8ej553c09jqBROwtiqUm/NJcZT
st4GvcFqZibzTNrzWMFpWKpIo3ps5ugSPxQ4+M8IBiY4FPu4rGrT1TECMNdELQDF
A7dSLb8hAgMBAAECggEAQir3sbllO5i0bJ9LZOIkyZPxcLooq6V5A/hO9y7p2r/4
0Reqj9gzGbjp7fZDyhm+C0lZNc56IsR6fO9agVHPpXjZhfedg5WaVQMPdvfD+G6H
tLl2iB7MsWxwz8It4aDM7xG6wFp+zO4GrfvEQaaAhaaSh/Jc9pK2T+R8KqSgrosu
JiphPtAqSB0H1fs2R+C2XB5xhzH9k/y4j8dnWri/w/sA824Dv50n6qs/klYcsE4V
Hvyo7f82ET+5ARcZmzBYQhy9XU92+ZcCv+AIQsjZKwYIYIJVoBH24O9ZAEB7scpT
gM4iZ/er6B54fYKfkyxdZEtiVPI/gpgbMbE7XxDZDwKBgQDQvAZEsrAIf40X4Scd
4gBAbLeoRWXMIM5JGv2lSGEI3l8P0wEvS0Ijl/eJXZYkm8TWqdWfKJUiThZG6XNy
4ReLdO/nmGMYWFKRj5fYzx9icVHj5vNPm8Xxsol7z+QXtxKzxQyGGc6WLKr+nCBv
vzU57iEiwoiGoW0AR5+JUlfPlwKBgQC37aabxyjPZxBjY4Ja3vWppveBq0WvSPFJ
hZPocxWlSfg2JFdRQA1gxaeQmtdcXgVflj7PV71i81317zw41J5A3CcG4mTOSBNi
vh9iRtvYSZ77Zb60z+qugYXxRrVa7Pw9uq+hJG+6CLRFm+s5MVXco2J3WCClaIUw
1eLPHpO+BwKBgBV3gN2H0vrMw2H1UeSM3aHCjJDNsk5wAUcbc4KQEwqqc/RYqwKG
JuMqOdbyvQI+0tuQ09tufQfuJ/RbBfiGlblN6W5UCbzzOGqn7eHqSzwAk39wvQ0u
5AibZ/BHzRlzRoUees8/0DM5nMxamitj6sFucBH3F7tg1qj0tL+WrFk5AoGATlk4
qJEM7FR94aiI5camJQ+PzTe1JnbO+b+iAtnLNa6twfp3C5BaYoev2mRrKtiON2qb
9NzuOtFqjBHNuHOxufVN1pvnzwta3qwYWFfQ3HB3/aUYuJL86DsaYG37YPEkffMh
T2ZjBX8hs6k4aRN//M3IawgqV+uPGP9zb0EaNE8CgYAmuXZAghkvXzik56pj2YNa
xBJtWQO9+7u/HUDj++Yrgol/hSsuRRanoRrps7BVDRppz/79w+EuV1ymRYSKn3gn
aL088awZteWsdxqZm948XNXiR9CktoAGpV3vxS3ZOdKU13nvNVBL2sw1RX0scbQS
RdaAHbBt1KxwprhIP728Uw==
-----END PRIVATE KEY-----`;

describe('buildKeyStore', () => {
  it('signs RS256 tokens and exposes JWKS entries', async () => {
    const env = {
      JWT_KEYS: JSON.stringify({ k1: PRIVATE_KEY_ONE }),
      JWT_ACTIVE_KID: 'k1',
      JWT_ISSUER: 'issuer',
      JWT_AUDIENCE: 'aud',
      JWT_EXPIRES_IN: '120s',
    };
    const store = await buildKeyStore(env);
    expect(store.activeKid).toBe('k1');
    expect(store.jwks.keys).toHaveLength(1);

    const token = await store.sign({ sub: 'user-1', role: 'admin' });
    const verified = await store.verify(token);

    expect(verified.payload.sub).toBe('user-1');
    expect(verified.protectedHeader.kid).toBe('k1');
  });

  it('verifies legacy tokens when keys rotate', async () => {
    const env = {
      JWT_KEYS: JSON.stringify({ k1: PRIVATE_KEY_ONE, k2: PRIVATE_KEY_TWO }),
      JWT_ACTIVE_KID: 'k2',
      JWT_ISSUER: 'issuer',
      JWT_AUDIENCE: 'aud',
    };
    const store = await buildKeyStore(env);
    expect(store.activeKid).toBe('k2');

    const legacySigner = await signer({ kid: 'k1', alg: 'RS256', privatePEM: PRIVATE_KEY_ONE });
    const legacyToken = await legacySigner.sign({ sub: 'legacy-user' }, { iss: 'issuer', aud: 'aud', expSec: 300 });

    const legacy = await store.verify(legacyToken);
    expect(legacy.payload.sub).toBe('legacy-user');
    expect(legacy.protectedHeader.kid).toBe('k1');

    const currentToken = await store.sign({ sub: 'current-user' });
    const current = await store.verify(currentToken);
    expect(current.protectedHeader.kid).toBe('k2');
  });
});
