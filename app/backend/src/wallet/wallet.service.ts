import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number) {
    return this.prisma.wallet.create({ data: { userId, balance: 0 } });
  }

  async upsert(userId: number, amount: number) {
    return this.prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: amount },
      update: { balance: { increment: amount } }
    });
  }

  async findOne(userId: number) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    return wallet ?? { userId, balance: 0 };
  }

  async debit(userId: number, amount: number) {
    return this.prisma.wallet.update({ where: { userId }, data: { balance: { decrement: amount } } });
  }
}
