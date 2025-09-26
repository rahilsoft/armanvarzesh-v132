import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class AdminIpAllowlistMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const list = (process.env.ADMIN_IP_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);
    if (req.path.startsWith('/admin')) {
      const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').toString();
      if (list.length && !list.some(allowed => ip.includes(allowed))) {
        return res.status(403).json({ message: 'Forbidden (IP)' });
      }
    }
    next();
  }
}
