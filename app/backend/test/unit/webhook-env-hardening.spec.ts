import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import {
  computeWebhookSignature,
  verifyWebhookSignature,
} from '../../src/common/security/webhook-signature';
import { envValidationSchema } from '../../src/config/env.validation';
import { domainJwtOptions, domainJwtSecret } from '../../src/lib/domain/domain.module';

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

const SECRET = 's'.repeat(40);
const body = { orderId: 'o-1', amount: 1000, status: 'paid' };

describe('verifyWebhookSignature fail-closed', () => {
  it.each(['staging', 'production'])('NODE_ENV=%s rejects missing secret', (env) => {
    process.env.NODE_ENV = env;
    expect(() => verifyWebhookSignature('payments', body, undefined)).toThrow(UnauthorizedException);
    expect(() => verifyWebhookSignature('payments', body, '')).toThrow(UnauthorizedException);
  });

  it('unset NODE_ENV rejects missing secret', () => {
    delete process.env.NODE_ENV;
    expect(() => verifyWebhookSignature('medical', body, undefined)).toThrow(/not configured/);
  });

  it('unknown NODE_ENV rejects missing secret', () => {
    process.env.NODE_ENV = 'prod';
    expect(() => verifyWebhookSignature('booking', body, undefined)).toThrow(UnauthorizedException);
  });

  it.each(['test', 'development'])('NODE_ENV=%s allows missing secret', (env) => {
    process.env.NODE_ENV = env;
    expect(() => verifyWebhookSignature('payments', body, undefined)).not.toThrow();
  });

  describe('with secret (staging)', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'staging';
    });

    it('valid signature passes', () => {
      const signature = computeWebhookSignature(SECRET, body);
      expect(() => verifyWebhookSignature('payments', { ...body, signature }, SECRET)).not.toThrow();
    });

    it('tampered body fails', () => {
      const signature = computeWebhookSignature(SECRET, body);
      expect(() =>
        verifyWebhookSignature('payments', { ...body, amount: 1, signature }, SECRET),
      ).toThrow(UnauthorizedException);
    });

    it('tampered signature fails', () => {
      const signature = computeWebhookSignature(SECRET, body);
      const bad = (signature[0] === 'a' ? 'b' : 'a') + signature.slice(1);
      expect(() =>
        verifyWebhookSignature('payments', { ...body, signature: bad }, SECRET),
      ).toThrow(UnauthorizedException);
    });

    it('signature from wrong secret fails', () => {
      const signature = computeWebhookSignature('o'.repeat(40), body);
      expect(() => verifyWebhookSignature('payments', { ...body, signature }, SECRET)).toThrow(
        UnauthorizedException,
      );
    });

    it('missing signature is a bad request', () => {
      expect(() => verifyWebhookSignature('payments', body, SECRET)).toThrow(BadRequestException);
    });
  });
});

describe('env schema: NODE_ENV staging + CERT_SECRET', () => {
  const base = {
    DATABASE_URL: 'postgres://u:p@localhost:5432/db',
    JWT_SECRET: 'j'.repeat(32),
  };
  const opts = { allowUnknown: true };
  const cert32 = 'c'.repeat(32);

  it('accepts staging as a valid NODE_ENV', () => {
    expect(
      envValidationSchema.validate({ ...base, NODE_ENV: 'staging', CERT_SECRET: cert32 }, opts).error,
    ).toBeUndefined();
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(
      envValidationSchema.validate({ ...base, NODE_ENV: 'prod', CERT_SECRET: cert32 }, opts).error,
    ).toBeDefined();
  });

  it.each(['staging', 'production'])('NODE_ENV=%s requires CERT_SECRET', (env) => {
    expect(envValidationSchema.validate({ ...base, NODE_ENV: env }, opts).error?.message).toMatch(
      /CERT_SECRET/,
    );
  });

  it('unset NODE_ENV requires CERT_SECRET', () => {
    expect(envValidationSchema.validate(base, opts).error?.message).toMatch(/CERT_SECRET/);
  });

  it('staging requires JWT_SECRET', () => {
    const { JWT_SECRET: _j, ...noJwt } = base;
    expect(
      envValidationSchema.validate({ ...noJwt, NODE_ENV: 'staging', CERT_SECRET: cert32 }, opts).error
        ?.message,
    ).toMatch(/JWT_SECRET/);
  });

  it('rejects CERT_SECRET of 31 chars', () => {
    const { error } = envValidationSchema.validate(
      { ...base, NODE_ENV: 'production', CERT_SECRET: 'c'.repeat(31) },
      opts,
    );
    expect(error?.message).toMatch(/CERT_SECRET/);
  });

  it('rejects a 31-char CERT_SECRET even in test', () => {
    expect(
      envValidationSchema.validate({ ...base, NODE_ENV: 'test', CERT_SECRET: 'c'.repeat(31) }, opts)
        .error,
    ).toBeDefined();
  });

  it('accepts CERT_SECRET of 32 chars', () => {
    expect(
      envValidationSchema.validate({ ...base, NODE_ENV: 'production', CERT_SECRET: cert32 }, opts)
        .error,
    ).toBeUndefined();
  });

  it('test env does not require CERT_SECRET', () => {
    expect(envValidationSchema.validate({ ...base, NODE_ENV: 'test' }, opts).error).toBeUndefined();
  });
});

describe('DomainModule JWT registration', () => {
  const cfg = (v?: string) => ({ get: () => v }) as unknown as ConfigService;

  it('throws when JWT_SECRET is missing (no fallback)', () => {
    expect(() => domainJwtSecret(cfg(undefined))).toThrow(/Missing required env: JWT_SECRET/);
  });

  it('throws when JWT_SECRET is shorter than 32', () => {
    expect(() => domainJwtSecret(cfg('x'.repeat(31)))).toThrow(/at least 32/);
  });

  it('options carry the validated secret and pin HS256', () => {
    const opts = domainJwtOptions(cfg('x'.repeat(32)));
    expect(opts.secret).toBe('x'.repeat(32));
    expect(opts.signOptions?.algorithm).toBe('HS256');
    expect(opts.verifyOptions?.algorithms).toEqual(['HS256']);
  });

  it('JwtService signs HS256 with config secret and rejects HS512', async () => {
    const strong = 'k'.repeat(40);
    process.env.JWT_SECRET = strong;
    const mod = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: domainJwtOptions,
        }),
      ],
    }).compile();
    const svc = mod.get(JwtService);
    const token = svc.sign({ sub: '1' });
    expect(jwt.decode(token, { complete: true })?.header.alg).toBe('HS256');
    expect(jwt.verify(token, strong)).toMatchObject({ sub: '1' });
    const hs512 = jwt.sign({ sub: '1' }, strong, { algorithm: 'HS512' });
    expect(() => svc.verify(hs512)).toThrow();
  });
});
