import { Pool, PoolConfig } from 'pg';
import pino from 'pino';
import { z } from 'zod';

const Env = z.object({
  DATABASE_URL: z.string().url().optional(),
  PGSSLMODE: z.enum(['disable','prefer','require']).default('prefer').optional(),
});

export type DbContext = {
  pool: Pool | null;
  ready: boolean;
};

export function createDbContext(env: NodeJS.ProcessEnv = process.env): DbContext {
  const parsed = Env.safeParse(env);
  if (!parsed.success || !parsed.data.DATABASE_URL) {
    return { pool: null, ready: false };
  }
  const logger = pino({ level: env.LOG_LEVEL || 'info' });
  const cfg: PoolConfig = { connectionString: parsed.data.DATABASE_URL };
  // Basic SSL toggle for managed Postgres providers
  if ((env.NODE_ENV === 'production' || env.PGSSLMODE === 'require')) {
    // @ts-ignore
    cfg.ssl = { rejectUnauthorized: false };
  }
  const pool = new Pool(cfg);
  pool.on('error', (err) => logger.error({ err }, 'pg pool error'));
  return { pool, ready: true };
}

export async function dbPing(ctx: DbContext): Promise<boolean> {
  if (!ctx.pool) return false;
  try {
    const res = await ctx.pool.query('SELECT 1');
    return res.rowCount === 1;
  } catch {
    return false;
  }
}
