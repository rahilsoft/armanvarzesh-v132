import { certSecret } from '../../src/courses/courses.service';

describe('certSecret', () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });
  it('rejects 31 chars in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.CERT_SECRET = 'a'.repeat(31);
    expect(() => certSecret()).toThrow(/>=32/);
  });
  it('accepts 32 chars', () => {
    process.env.NODE_ENV = 'production';
    process.env.CERT_SECRET = 'a'.repeat(32);
    expect(certSecret()).toBe('a'.repeat(32));
  });
});
