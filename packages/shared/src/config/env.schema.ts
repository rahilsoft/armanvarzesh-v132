import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  HOST: z.string().default('0.0.0.0'),
  API_PREFIX: z.string().optional(),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  RABBITMQ_URL: z.string().min(1),

  MINIO_ENDPOINT: z.string().default('minio'),
  MINIO_PORT: z.string().transform(Number).default('9000'),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),

  JWT_SECRET: z.string().min(1).default('change_me'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  CORS_ORIGINS: z.string().optional(), // comma separated
});
export type Env = z.infer<typeof EnvSchema>;