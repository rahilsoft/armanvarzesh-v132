
import { Controller, Get, Param } from '@nestjs/common';
import { CorporateService } from '../corporate.service';
import { Corporate } from '../entities/corporate.entity';

@Controller('corporate')
export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Corporate[]> {
    return this.corporateService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Corporate> {
    return this.corporateService.findOne(Number(id));
  }
}