import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as otplib from 'otplib';

@Injectable()
export class TotpService {
  private prisma = new PrismaClient();

  async enable(userId: string) {
    const secret = otplib.authenticator.generateSecret();
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });
    const otpauth = otplib.authenticator.keyuri(userId, 'ArmanFit', secret);
    return { otpauth }; // client می‌تواند QR بسازد
  }

  async verify(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new UnauthorizedException('2FA not initialized');
    const ok = otplib.authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!ok) throw new UnauthorizedException('Invalid 2FA code');
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
    return { ok: true };
  }

  async disable(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
    return { ok: true };
  }
}