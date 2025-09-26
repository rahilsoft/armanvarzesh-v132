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

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
    }),
  ],
  controllers: [AuthController, TotpController, PasswordResetController],
  providers: [AuthService, JwtStrategy, TotpService, PasswordResetService],
})
export class AuthModule {}