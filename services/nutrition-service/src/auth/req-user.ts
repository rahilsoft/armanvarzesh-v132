import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Numeric user id from a verified Bearer JWT. There is NO x-user-id header or
 * query fallback (those allowed any caller to act as any user) and NO fallback
 * secret. JWT_SECRET is required; verification pins HS256. Throws 401 when the
 * token is missing or invalid.
 */
function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET is not configured (minimum 16 characters required)');
  }
  return s;
}

export function userIdFromReq(req: any): number {
  const auth = (req?.headers?.authorization || '').toString();
  if (!auth.startsWith('Bearer ')) throw new UnauthorizedException('missing bearer token');
  let claims: any;
  try {
    claims = jwt.verify(auth.slice(7), jwtSecret(), { algorithms: ['HS256'] });
  } catch {
    throw new UnauthorizedException('invalid token');
  }
  const id = Number(claims?.sub ?? claims?.userId ?? claims?.id);
  if (!Number.isInteger(id) || id <= 0) throw new UnauthorizedException('invalid user id in token');
  return id;
}
