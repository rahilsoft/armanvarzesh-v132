import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { TotpService } from './totp.service';
import { TotpController } from './totp.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TokenBlacklistService } from './token-blacklist.service';
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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret(),
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [AuthController, TotpController, PasswordResetController],
  providers: [
    PrismaService,
    AuthService,
    JwtStrategy,
    TokenBlacklistService,
    TotpService,
    PasswordResetService,
  ],
  exports: [AuthService, TokenBlacklistService, PrismaService],
})
export class AuthModule {}
