import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { HS_ALGORITHMS, MIN_JWT_SECRET_LENGTH } from '../../config/jwt-secrets';
import { SafePrismaService } from '../data/prisma.safe';
import { UserRepository } from '../data/repositories/user.repository';
import { PaymentRepository } from '../data/repositories/payment.repository';
import { AuthUseCase } from './auth.usecase';
import { PaymentsUseCase } from './payments.usecase';

/** Validated JWT_SECRET from config: required, >= 32 chars, no fallback. */
export function domainJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (!secret) throw new Error('Missing required env: JWT_SECRET');
  if (secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
  }
  return secret;
}

/** JwtModule options: config-validated secret, HS256 pinned for sign and verify. */
export function domainJwtOptions(config: ConfigService): JwtModuleOptions {
  return {
    secret: domainJwtSecret(config),
    signOptions: { algorithm: 'HS256' },
    verifyOptions: { algorithms: HS_ALGORITHMS },
  };
}

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: domainJwtOptions,
    }),
  ],
  providers: [SafePrismaService, UserRepository, PaymentRepository, AuthUseCase, PaymentsUseCase],
  exports: [AuthUseCase, PaymentsUseCase, UserRepository, PaymentRepository, SafePrismaService],
})
export class DomainModule {}
