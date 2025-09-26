import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordResetService {
  private prisma = new PrismaClient();

  async request(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const plain = randomBytes(32).toString('hex');
    const tokenHash = await argon2.hash(plain);
    const expiresAt = new Date(Date.now() + 1000*60*30); // 30m
    await this.prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
    // TODO: ارسال ایمیل واقعی؛ فعلاً token را برمی‌گردانیم (dev)
    return { token: plain, expiresAt };
  }

  async confirm(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const rec = await this.prisma.passwordResetToken.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } as any });
    if (!rec) throw new UnauthorizedException('No reset requested');
    const ok = await argon2.verify(rec.tokenHash, token);
    if (!ok || rec.expiresAt < new Date() || rec.usedAt) throw new UnauthorizedException('Reset token invalid');
    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await this.prisma.passwordResetToken.update({ where: { id: rec.id }, data: { usedAt: new Date() } });
    return { ok: true };
  }
}