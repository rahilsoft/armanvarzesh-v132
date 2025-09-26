import { Controller, Get, Param } from '@nestjs/common';
import { WorkoutsService } from '../workouts.service';
import { Workout as PrismaWorkout } from '@prisma/client';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll(): Promise<PrismaWorkout[]> {
    return this.workoutsService.findAll();
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<PrismaWorkout> {
    return this.workoutsService.findOne(Number(id));
  }
}