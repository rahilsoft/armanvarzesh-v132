
import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceResolver } from './marketplace.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [MarketplaceService, MarketplaceResolver, PrismaService],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
