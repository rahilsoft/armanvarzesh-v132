
import { Controller, Get, Param } from '@nestjs/common';
import { CmsService } from '../cms.service';
import { Cms } from '../entities/cms.entity';

@Controller('contents')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Cms[]> {
    return this.cmsService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Cms> {
    return this.cmsService.findOne(Number(id));
  }
}