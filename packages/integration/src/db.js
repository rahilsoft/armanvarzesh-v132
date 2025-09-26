"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbContext = createDbContext;
exports.dbPing = dbPing;
const pg_1 = require("pg");
const pino_1 = __importDefault(require("pino"));
const zod_1 = require("zod");
const Env = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url().optional(),
    PGSSLMODE: zod_1.z.enum(['disable', 'prefer', 'require']).default('prefer').optional(),
});
function createDbContext(env = process.env) {
    const parsed = Env.safeParse(env);
    if (!parsed.success || !parsed.data.DATABASE_URL) {
        return { pool: null, ready: false };
    }
    const logger = (0, pino_1.default)({ level: env.LOG_LEVEL || 'info' });
    const cfg = { connectionString: parsed.data.DATABASE_URL };
    // Basic SSL toggle for managed Postgres providers
    if ((env.NODE_ENV === 'production' || env.PGSSLMODE === 'require')) {
        // @ts-ignore
        cfg.ssl = { rejectUnauthorized: false };
    }
    const pool = new pg_1.Pool(cfg);
    pool.on('error', (err) => logger.error({ err }, 'pg pool error'));
    return { pool, ready: true };
}
async function dbPing(ctx) {
    if (!ctx.pool)
        return false;
    try {
        const res = await ctx.pool.query('SELECT 1');
        return res.rowCount === 1;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=db.js.map