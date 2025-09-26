import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

export type CspMode = 'baseline' | 'nonce';
export type CspOptions = {
  mode?: CspMode;
};

export function cspMiddleware(opts: CspOptions = {}) {
  const mode = opts.mode || (process.env.CSP_NONCE_MODE === "1" ? 'nonce' : 'baseline');
  if (mode === 'nonce') {
    return function cspNonce(req: Request, res: Response, next: NextFunction){
      const nonce = crypto.randomBytes(16).toString('base64');
      // expose nonce for templating layers
      (res.locals as any).cspNonce = nonce;
      const policy = {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'", `'nonce-${nonce}'`], // templates must use this nonce in prod
          "style-src": ["'self'", "'unsafe-inline'", "https:"],
          "img-src": ["'self'", "data:", "https:"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "frame-ancestors": ["'self'"],
          "connect-src": ["'self'"]
        }
      } as any;
      return helmet.contentSecurityPolicy(policy)(req,res,next);
    }
  }
  // baseline (compatible, not breaking)
  return helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "font-src": ["'self'", "https:", "data:"],
      "img-src": ["'self'", "data:", "https:"],
      "object-src": ["'none'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "script-src-attr": ["'none'"],
      "style-src": ["'self'", "'unsafe-inline'", "https:"],
      "connect-src": ["'self'"]
    }
  } as any);
}