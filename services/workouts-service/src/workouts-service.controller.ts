import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WorkoutsService } from './workouts-service.service';

@ApiTags('workouts')
@ApiBearerAuth()
@Controller('workouts')
export class Workouts_serviceController {
  constructor(private readonly svc: WorkoutsService) {}

  @Get()
/** @deprecated AUTO-MARKED (Stage19): GQL op 'q' is unused per Stage 07 census. */
  list(@Query('q') q?: string) {
    return this.svc.list(q);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}