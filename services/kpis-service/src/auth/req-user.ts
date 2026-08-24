import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Numeric coach id from a verified Bearer JWT. There is NO x-coach-id header
 * fallback and no default id (those let any caller read any coach's KPIs) and
 * NO fallback secret. JWT_SECRET is required; verification pins HS256. Throws
 * 401 when the token is missing or invalid.
 */
function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET is not configured (minimum 16 characters required)');
  }
  return s;
}

export function coachIdFromReq(req: any): number {
  const auth = (req?.headers?.authorization || '').toString();
  if (!auth.startsWith('Bearer ')) throw new UnauthorizedException('missing bearer token');
  let claims: any;
  try {
    claims = jwt.verify(auth.slice(7), jwtSecret(), { algorithms: ['HS256'] });
  } catch {
    throw new UnauthorizedException('invalid token');
  }
  const id = Number(claims?.sub ?? claims?.userId ?? claims?.id);
  if (!Number.isInteger(id) || id <= 0) throw new UnauthorizedException('invalid coach id in token');
  return id;
}
