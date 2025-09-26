
import { Controller, Get, Param } from '@nestjs/common';
import { SupportService } from '../support.service';
import { Support } from '../entities/support.entity';

@Controller('tickets')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Support[]> {
    return this.supportService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Support> {
    return this.supportService.findOne(Number(id));
  }
}