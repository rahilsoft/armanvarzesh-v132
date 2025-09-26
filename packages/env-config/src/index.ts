import { z } from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development','test','staging','production']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  DATABASE_URL: z.string().url().or(z.string().startsWith('postgres')).describe('PostgreSQL connection string'),
  REDIS_URL: z.string().optional(),
  JWT_ISSUER: z.string().optional(),
  JWT_AUDIENCE: z.string().optional(),
  JWKS_URL: z.string().url().optional(),          // for verifying external tokens
  JWKS_PRIVATE_PEM: z.string().optional(),        // PEM (PKCS#8) for signing (dev)
  JWT_ALG: z.enum(['RS256','ES256','HS256']).default('RS256'),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(raw: NodeJS.ProcessEnv): Env {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
}
