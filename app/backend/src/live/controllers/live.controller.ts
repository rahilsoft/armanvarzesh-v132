
import { Controller, Get, Param } from '@nestjs/common';
import { LiveService } from '../live.service';
import { Live } from '../entities/live.entity';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Live[]> {
    return this.liveService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Live> {
    return this.liveService.findOne(Number(id));
  }
}