"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'staging', 'production']).default('development'),
    PORT: zod_1.z.string().regex(/^\d+$/).transform(Number).default('3000'),
    DATABASE_URL: zod_1.z.string().url().or(zod_1.z.string().startsWith('postgres')).describe('PostgreSQL connection string'),
    REDIS_URL: zod_1.z.string().optional(),
    JWT_ISSUER: zod_1.z.string().optional(),
    JWT_AUDIENCE: zod_1.z.string().optional(),
    JWKS_URL: zod_1.z.string().url().optional(), // for verifying external tokens
    JWKS_PRIVATE_PEM: zod_1.z.string().optional(), // PEM (PKCS#8) for signing (dev)
    JWT_ALG: zod_1.z.enum(['RS256', 'ES256', 'HS256']).default('RS256'),
});
function validateEnv(raw) {
    const parsed = exports.EnvSchema.safeParse(raw);
    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables');
    }
    return parsed.data;
}
//# sourceMappingURL=index.js.map