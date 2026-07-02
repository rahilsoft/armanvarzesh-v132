import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { HabitType, Prisma } from '@prisma/client';
import { NutritionGoalsService } from '../goals.service';
import { HydrationService } from '../hydration.service';
import { HabitsService } from '../habits.service';

/**
 * Canonical REST surface for the tracking capabilities folded from
 * services/nutrition-service (goals, hydration, habits). Former service
 * routes `v1/health/hydration` and `v1/habits` map here under `nutrition/*`
 * (see services/nutrition-service/DEPRECATED.md for the route table).
 */

class SetGoalDto {
  @IsInt() userId!: number;
  @IsNumber() @Min(0) calories!: number;
  @IsNumber() @Min(0) protein!: number;
  @IsNumber() @Min(0) carbs!: number;
  @IsNumber() @Min(0) fats!: number;
}

class LogHydrationDto {
  @IsInt() userId!: number;
  @Type(() => Date) @IsDate() occurredAt!: Date;
  @IsInt() @Min(1) ml!: number;
  @IsOptional() @IsString() source?: string;
}

class CreateHabitDto {
  @IsInt() userId!: number;
  @IsEnum(HabitType) type!: HabitType;
  @IsNumber() @Min(0) target!: number;
  @IsObject() cadence!: Record<string, unknown>;
  @IsString() tz!: string;
}

class LogHabitDto {
  @Type(() => Date) @IsDate() occurredAt!: Date;
  @IsNumber() value!: number;
  @IsOptional() @IsObject() meta?: Record<string, unknown>;
}

@Controller('nutrition')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class NutritionTrackingController {
  constructor(
    private readonly goals: NutritionGoalsService,
    private readonly hydration: HydrationService,
    private readonly habits: HabitsService,
  ) {}

  /*** Goals ***/

  @Put('goal')
  setGoal(@Body() dto: SetGoalDto) {
    return this.goals.setGoal(dto);
  }

  @Get('goal/:userId')
  getGoal(@Param('userId', ParseIntPipe) userId: number) {
    return this.goals.getGoal(userId);
  }

  /*** Hydration ***/

  @Post('hydration')
  logHydration(@Body() dto: LogHydrationDto) {
    return this.hydration.create(dto);
  }

  @Get('hydration/:userId')
  hydrationRange(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const toDate = to ? new Date(to) : new Date();
    const fromDate = from ? new Date(from) : new Date(toDate.getTime() - 24 * 60 * 60 * 1000);
    return this.hydration.getRange(userId, fromDate, toDate);
  }

  /*** Habits ***/

  @Post('habits')
  createHabit(@Body() dto: CreateHabitDto) {
    return this.habits.createHabit({ ...dto, cadence: dto.cadence as Prisma.InputJsonValue });
  }

  @Post('habits/:id/log')
  logHabit(@Param('id', ParseIntPipe) habitId: number, @Body() dto: LogHabitDto) {
    return this.habits.logHabit({ habitId, occurredAt: dto.occurredAt, value: dto.value, meta: dto.meta as Prisma.InputJsonValue | undefined });
  }

  @Get('habits/today/:userId')
  habitsToday(@Param('userId', ParseIntPipe) userId: number) {
    return this.habits.getToday(userId);
  }
}
