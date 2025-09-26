import { z } from 'zod';

export const EnvSchema = z.object({
  SERVICE_NAME: z.string().min(1).default('service'),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.string().default('info'),
  CORS_ORIGINS: z.string().optional().default(''),
  NODE_ENV: z.string().default('development')
});

export type EnvConfig = z.infer<typeof EnvSchema> & { CORS_ORIGINS: string[] };

export function loadEnv(partial?: Partial<Record<string,string>>): EnvConfig {
  const parsed = EnvSchema.parse({ ...process.env, ...partial });
  const corsList = (parsed.CORS_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
  return { ...parsed, CORS_ORIGINS: corsList };
}
