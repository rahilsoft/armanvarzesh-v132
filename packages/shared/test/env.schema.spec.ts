import { EnvSchema } from '../src/config/env.schema';

const required = {
  DATABASE_URL: 'postgresql://localhost/db',
  REDIS_URL: 'redis://localhost:6379',
  RABBITMQ_URL: 'amqp://localhost',
  MINIO_ACCESS_KEY: 'key',
  MINIO_SECRET_KEY: 'secret',
};

describe('EnvSchema ports (zod 4 default before transform)', () => {
  it('defaults PORT and MINIO_PORT to numbers when unset', () => {
    const env = EnvSchema.parse(required);
    expect(env.PORT).toBe(3000);
    expect(env.MINIO_PORT).toBe(9000);
  });

  it('converts provided port strings to numbers', () => {
    const env = EnvSchema.parse({ ...required, PORT: '8080', MINIO_PORT: '9001' });
    expect(env.PORT).toBe(8080);
    expect(env.MINIO_PORT).toBe(9001);
  });
});
