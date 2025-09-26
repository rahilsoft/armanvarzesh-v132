// Phase H — payments rate limit middleware
import rateLimit from 'express-rate-limit';
export function paymentsRateLimiter() {
  const cfg = (process.env.PAYMENTS_RATE_LIMIT || '60:60').split(':').map(x=>parseInt(x,10));
  const windowSec = (cfg[1] || 60);
  const maxReq = (cfg[0] || 60);
  return rateLimit({ windowMs: windowSec*1000, max: maxReq, standardHeaders: true, legacyHeaders: false });
}
