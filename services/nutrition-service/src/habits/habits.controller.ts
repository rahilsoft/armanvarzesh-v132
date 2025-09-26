
import { Controller, Post, Body, Param, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { ZodValidationPipe } from '@arman/shared';
import { HabitsService } from './habits.service';
import { HabitType } from '@prisma/client';

const createHabitDto = z.object({
  type: z.nativeEnum(HabitType),
  target: z.number().positive(),
  cadence: z.any(), // JSON cadence (e.g., daily times)
  tz: z.string(),
});

const logHabitDto = z.object({
  occurredAt: z.string().datetime().optional(),
  value: z.number().nonnegative(),
  meta: z.any().optional(),
});

@ApiTags('habits')
@ApiBearerAuth()
@Controller('v1/habits')
export class HabitsController {
  constructor(private readonly svc: HabitsService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createHabitDto)) body: any, @Req() req: any) {
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    return this.svc.createHabit({
      userId,
      type: body.type,
      target: body.target,
      cadence: body.cadence,
      tz: body.tz,
    });
  }

  @Post(':id/log')
  async log(@Param('id') id: string, @Body(new ZodValidationPipe(logHabitDto)) body: any) {
    return this.svc.logHabit({
      habitId: Number(id),
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
      value: body.value,
      meta: body.meta ?? {},
    });
  }

  @Get('today')
  async today(@Req() req: any) {
    const userId = Number(req.user?.id || req.headers['x-user-id'] || req.query.userId);
    return this.svc.getToday(userId);
  }
}
