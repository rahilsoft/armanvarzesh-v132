import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { JwtKidService } from './security/jwt-rotator.service';

export function applySecurity(app: any) {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:", "blob:"],
        "script-src": ["'self'"],
        "connect-src": ["'self'", "*"],
      }
    },
    crossOriginEmbedderPolicy: false,
  }));

  const windowMs = Number(process.env.RL_WINDOW_MS || 60000);
  const maxPerWindow = Number(process.env.RL_MAX || 120);
  const keyGen = (req: any) => {
    const token = (req.headers['authorization'] || '').toString();
    if (token) return 'tok:' + token.slice(0, 24);
    return req.ip || 'ip:unknown';
  };
  app.use(rateLimit({ windowMs, max: maxPerWindow, keyGenerator: keyGen }));
}
