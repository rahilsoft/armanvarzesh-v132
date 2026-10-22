import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Identity for chat comes ONLY from a verified Bearer JWT. Neither the HTTP
 * routes nor the WebSocket handshake may take userId/role from client-supplied
 * query params or headers — that let any caller act as any user, and claim the
 * 'coach' role, in any thread. JWT_SECRET is required; verification pins HS256.
 */
export interface ChatIdentity {
  userId: string;
  role: 'user' | 'coach';
}

function jwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET is not configured (minimum 16 characters required)');
  }
  return s;
}

/** Verify a raw JWT and project it onto a chat identity. Throws 401 when invalid. */
export function identityFromToken(token: string | undefined): ChatIdentity {
  if (!token) throw new UnauthorizedException('missing bearer token');
  let claims: any;
  try {
    claims = jwt.verify(token, jwtSecret(), { algorithms: ['HS256'] });
  } catch {
    throw new UnauthorizedException('invalid token');
  }
  const userId = String(claims?.sub ?? claims?.userId ?? claims?.id ?? '').trim();
  if (!userId) throw new UnauthorizedException('invalid user id in token');
  // The role is taken from the signed token, never from the client.
  return { userId, role: claims?.role === 'coach' ? 'coach' : 'user' };
}

/** Identity from an Express request's Authorization header. */
export function identityFromReq(req: any): ChatIdentity {
  const auth = (req?.headers?.authorization || '').toString();
  if (!auth.startsWith('Bearer ')) throw new UnauthorizedException('missing bearer token');
  return identityFromToken(auth.slice(7));
}

/**
 * Identity from a Socket.IO handshake. Accepts the token from `auth.token`
 * (preferred) or an `Authorization: Bearer` handshake header. The `userId` and
 * `role` query params that used to drive this are deliberately ignored.
 */
export function identityFromHandshake(client: any): ChatIdentity {
  const handshake = client?.handshake ?? {};
  const fromAuth = handshake.auth?.token;
  const header = (handshake.headers?.authorization || '').toString();
  const fromHeader = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  return identityFromToken(fromAuth || fromHeader);
}
