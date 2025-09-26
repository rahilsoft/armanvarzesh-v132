
import { Controller, Get, Param } from '@nestjs/common';
import { MarketplaceService } from '../marketplace.service';
import { Marketplace } from '../entities/marketplace.entity';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async findAll(): Promise<Marketplace[]> {
    return this.marketplaceService.findAll();
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Marketplace> {
    return this.marketplaceService.findOne(Number(id));
  }
}