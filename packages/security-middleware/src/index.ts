import type { RequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

export type SecurityOptions = {
  csp?: Parameters<typeof helmet.contentSecurityPolicy>[0];
  corsOrigin?: string | RegExp | (string|RegExp)[];
  rateWindowMs?: number;
  rateMax?: number;
};

export function applyBasicHardening(app: any, opts: SecurityOptions = {}) {
  try {
    if (!app || typeof app.use !== 'function') return;

    // Helmet + CSP
    const csp = opts.csp ?? {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "img-src": ["'self'", "data:", "https:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-inline'"], // tighten in prod with nonces
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "connect-src": ["'self'"]
      }
    };
    app.use(helmet());
    if (helmet.contentSecurityPolicy) app.use(helmet.contentSecurityPolicy(csp as any));

    // CORS (env override)
    const origin = opts.corsOrigin ?? process.env.CORS_ORIGIN ?? "*";
    app.use(cors({ origin, credentials: true }));

    // HPP (HTTP Parameter Pollution)
    app.use(hpp() as unknown as RequestHandler);

    // Rate limit (token/user aware can be added later via custom keyGenerator)
    const windowMs = opts.rateWindowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
    const max = opts.rateMax ?? Number(process.env.RATE_LIMIT_MAX ?? 120);
    app.use(rateLimit({ windowMs, max }));

    // X-Content-Type-Options, X-DNS-Prefetch-Control, etc. already covered by helmet()
  } catch (e) {
    // do not crash service because of middleware wiring
    // eslint-disable-next-line no-console
    console.warn("[security-middleware] Failed to apply hardening:", e);
  }
}
export { buildJwtVerifier, subjectFromReq } from './jwt';
export { buildUserAwareRateLimit } from './userRateLimit';
export { cspMiddleware } from './csp';

/**
 * Build individual security middlewares for services that wire them onto the
 * app themselves (e.g. `app.use(sec.cors)`).
 */
export function buildSecurityMiddleware(opts: SecurityOptions = {}): {
  cors: RequestHandler;
  helmet: RequestHandler;
  hpp: RequestHandler;
} {
  const origin = opts.corsOrigin ?? process.env.CORS_ORIGIN ?? '*';
  return {
    cors: cors({ origin, credentials: true }) as unknown as RequestHandler,
    helmet: helmet() as unknown as RequestHandler,
    hpp: hpp() as unknown as RequestHandler,
  };
}

/**
 * Build a configured CORS middleware. Accepts `{ origins }` (array) or falls
 * back to `CORS_ORIGIN` / wildcard.
 */
export function buildCors(opts: { origins?: (string | RegExp)[]; credentials?: boolean } = {}): RequestHandler {
  const origin = opts.origins && opts.origins.length ? opts.origins : (process.env.CORS_ORIGIN ?? '*');
  return cors({ origin: origin as any, credentials: opts.credentials ?? true }) as unknown as RequestHandler;
}
