
import { Controller, Get, Param } from '@nestjs/common';
import { CoachesService } from '../coaches.service';
import { Coach } from '../entities/coach.entity';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  async findAll(): Promise<Coach[]> {
    return this.coachesService.findAll();
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Coach> {
    return this.coachesService.findOne(Number(id));
  }
}