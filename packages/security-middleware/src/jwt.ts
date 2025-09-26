import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

export type JwtOptions = {
  jwksUrl?: string;           // e.g. https://issuer/.well-known/jwks.json
  issuer?: string | string[];
  audience?: string | string[];
  algorithms?: string[];      // e.g. ["RS256"]
  headerKidRequired?: boolean;
  cacheMaxAge?: number;       // ms, default 10 minutes
  authHeader?: string;        // default "authorization"
};

export function buildJwtVerifier(opts: JwtOptions = {}): RequestHandler {
  const jwksUrl = opts.jwksUrl || process.env.JWKS_URL;
  if (!jwksUrl) {
    // no-op middleware if not configured
    return (_req, _res, next)=> next();
  }
  const cacheMaxAge = typeof opts.cacheMaxAge === 'number' ? opts.cacheMaxAge : 10*60*1000;
  const JWKS = createRemoteJWKSet(new URL(jwksUrl), { cacheMaxAge });

  const hdr = (opts.authHeader || process.env.AUTH_HEADER || "authorization").toLowerCase();
  const algs = opts.algorithms || (process.env.JWT_ALGS ? process.env.JWT_ALGS.split(",") : undefined);
  const iss = opts.issuer || process.env.JWT_ISSUER;
  const aud = opts.audience || process.env.JWT_AUDIENCE;

  return async function jwtVerifier(req: Request, res: Response, next: NextFunction) {
    try {
      const raw = (req.headers[hdr] || req.headers[hdr.toUpperCase()]) as string | undefined;
      if (!raw || !raw.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ error: "missing_authorization" });
      }
      const token = raw.slice(7).trim();
      // verify
      const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
        issuer: iss as any, audience: aud as any, algorithms: algs as any
      });
      if ((opts.headerKidRequired || process.env.JWT_KID_REQUIRED === "1") && !protectedHeader.kid) {
        return res.status(401).json({ error: "kid_required" });
      }
      // attach to locals for downstream
      (res.locals as any).auth = { payload, header: protectedHeader, token };
      (req as any).auth = (res.locals as any).auth;
      next();
    } catch (e:any) {
      return res.status(401).json({ error: "invalid_token", message: e?.message || String(e) });
    }
  }
}

export function subjectFromReq(req: Request): string | undefined {
  const a = (req as any).auth?.payload as JWTPayload | undefined;
  return (a?.sub as string) || undefined;
}