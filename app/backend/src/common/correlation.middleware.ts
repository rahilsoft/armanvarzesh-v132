// Phase G — correlation id middleware
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const existing = (req.headers['x-correlation-id'] as string) || '';
  const cid = existing || uuidv4();
  (req as any).correlationId = cid;
  res.setHeader('X-Correlation-Id', cid);
  next();
}
