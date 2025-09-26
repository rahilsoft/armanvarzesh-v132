
import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from '../wallet.service';
import { Wallet } from '../entities/wallet.entity';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':userId')
  async getWallet(@Param('userId') userId: number): Promise<Wallet> {
    return this.walletService.findOne(Number(userId));
  }
}