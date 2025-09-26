
import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [WalletService, WalletResolver, PrismaService],
  exports: [WalletService]
})
export class WalletModule {}
