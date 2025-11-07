import { Request, Response, NextFunction } from 'express';

export interface HSTSOptions {
  maxAge?: number;
  includeSubDomains?: boolean;
  preload?: boolean;
}

/**
 * HSTS Middleware
 * Enforces HTTPS with strict configuration
 */
export function hstsMiddleware(options: HSTSOptions = {}) {
  const maxAge = options.maxAge || 31536000; // 1 year default
  const includeSubDomains = options.includeSubDomains !== false;
  const preload = options.preload !== false;

  let value = `max-age=${maxAge}`;
  if (includeSubDomains) value += '; includeSubDomains';
  if (preload) value += '; preload';

  return (req: Request, res: Response, next: NextFunction) => {
    // Only apply HSTS in production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', value);
    }
    next();
  };
}
