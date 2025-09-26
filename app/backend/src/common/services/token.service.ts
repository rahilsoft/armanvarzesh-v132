import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  sign(payload: object, expiresIn = '7d'): string {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return (jwt as any).sign(payload, secret, { expiresIn });
  }
  verify<T = any>(token: string): T {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return (jwt as any).verify(token, secret) as T;
  }
}
