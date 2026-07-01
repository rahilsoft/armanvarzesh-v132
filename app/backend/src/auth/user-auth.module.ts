import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../database/prisma.service';

/** Require a real signing secret in production; allow a marked dev fallback otherwise. */
function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to a strong value (>=16 chars) in production');
  }
  return 'dev-only-insecure-secret-change-me';
}

/**
 * Canonical first-party user authentication module. Ported from the former
 * services/auth-service into the modular monolith (core Int primary keys).
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret(),
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [UserAuthController],
  providers: [PrismaService, UserAuthService],
  exports: [UserAuthService],
})
export class UserAuthModule {}
