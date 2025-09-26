import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { subjectFromReq } from './jwt';

export type UserRateOptions = {
  windowMs?: number;
  max?: number;
  headerPrefix?: string; // for distinguishing buckets across environments
};

export function buildUserAwareRateLimit(opts: UserRateOptions = {}) {
  const windowMs = opts.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const max = opts.max ?? Number(process.env.RATE_LIMIT_MAX ?? 120);
  const prefix = (opts.headerPrefix ?? process.env.RATE_LIMIT_PREFIX ?? "rl") + ":";

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      const sub = subjectFromReq(req);
      if (sub) return prefix + "sub:" + String(sub);
      // fallback to token hash or IP
      const auth = String(req.headers.authorization || "");
      if (auth) return prefix + "tok:" + auth.slice(-16); // coarse token tail
      const ip = (req.ip || req.socket.remoteAddress || "0.0.0.0");
      return prefix + "ip:" + ip;
    }
  });
}