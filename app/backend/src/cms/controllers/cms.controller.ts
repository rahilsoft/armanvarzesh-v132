
import { Controller, Get, Param } from '@nestjs/common';
import { CmsService } from '../cms.service';

@Controller('contents')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<any[]> {
    return this.cmsService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.cmsService.findOne(Number(id));
  }
}