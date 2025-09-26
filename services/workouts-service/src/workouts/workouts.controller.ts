import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Post()
  create(@Body() dto: {userId: string; title: string; level: 'beginner'|'intermediate'|'advanced'; goal: 'fatloss'|'strength'|'hypertrophy'; equipment?: string[]}) {
    return this.svc.create(dto);
  }
}