import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

@Injectable()
export class ClickTrackingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('ClickTracking');

  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET' && req.path.includes('/page/')) {
      const userAgent = req.headers['user-agent'] || 'unknown';
      this.logger.log(`Click: ${req.path} - UA: ${userAgent}`);
    }
    next();
  }
}
