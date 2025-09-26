import type { Request, Response, NextFunction } from 'express';

const DEFAULT_MAX_BODY = 1024 * 1024; // 1MB

const denyPathPatterns = [
  /\.\.\//,             // path traversal
  /%2e%2e%2f/i,         // encoded traversal
  /\/\.git\//i,         // vcs
  /\/_internal\//i,
  /\/\.env/i,
  /\$(?:where|ne|gt|lt)/i, // nosql injection-ish
];

const denyHeaders = [
  'x-forwarded-host', // host header attacks via proxies
];

const denyMethods = ['TRACE', 'TRACK', 'CONNECT'];

export function waf(opts?: { maxBodyBytes?: number, allowOrigins?: string[] }){
  const maxBody = opts?.maxBodyBytes ?? DEFAULT_MAX_BODY;
  const allowOrigins = opts?.allowOrigins ?? ['http://localhost:19006','http://localhost:3000'];

  return function(req: Request, res: Response, next: NextFunction){
    // Method deny
    if (denyMethods.includes(req.method.toUpperCase())){
      return res.status(405).json({ code:'METHOD_NOT_ALLOWED' });
    }

    // Path checks
    const p = req.path || req.url || '';
    for (const pat of denyPathPatterns){
      if (pat.test(p)) return res.status(400).json({ code:'WAF_BLOCKED_PATH' });
    }

    // Host/CORS - strict allowlist if Origin present
    const origin = (req.headers['origin'] || req.headers['referer'] || '') as string;
    if (origin && !allowOrigins.some(o => origin.startsWith(o))){
      // Preflight safe: reply minimal CORS error
      return res.status(403).json({ code:'CORS_FORBIDDEN', message:'Origin not allowed' });
    }

    // Suspicious headers
    for (const h of denyHeaders){
      if (req.headers[h]) return res.status(400).json({ code:'WAF_BLOCKED_HEADER' });
    }

    // Body size (only for known content-length)
    const len = Number(req.headers['content-length'] || '0');
    if (!Number.isNaN(len) && len > maxBody){
      return res.status(413).json({ code:'PAYLOAD_TOO_LARGE' });
    }

    next();
  };
}
