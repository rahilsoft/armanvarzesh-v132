
import { Controller, Get, Param } from '@nestjs/common';
import { ExperimentsService } from '../experiments.service';
import { Experiment } from '../entities/experiment.entity';

@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Experiment[]> {
    return this.experimentsService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Experiment> {
    return this.experimentsService.findOne(Number(id));
  }
}