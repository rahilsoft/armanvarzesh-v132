import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import type { MealEntry, MealPlan, MacroTargets } from '@contracts/nutrition';

function roleFrom(req: any): 'user' | 'coach' | 'admin' {
  const r = req?.user?.role || req?.auth?.role || 'user';
  if (r === 'admin' || r === 'coach') return r;
  return 'user';
}

@Controller('nutrition/v1')
export class NutritionController {
  constructor(private readonly svc: NutritionService) {}

  @Get('users/:userId/meal-plan')
  async getMealPlan(@Param('userId') userId: string, @Req() req: any): Promise<MealPlan | null> {
    this.svc.ensureAccess(req?.user?.id || userId, userId, roleFrom(req));
    return this.svc.getMealPlan(userId);
  }

  @Put('users/:userId/meal-plan')
  async setMealPlan(@Param('userId') userId: string, @Body() plan: MealPlan, @Req() req: any) {
    this.svc.ensureAccess(req?.user?.id || userId, userId, roleFrom(req));
    await this.svc.setMealPlan(userId, plan);
    return { status: 'ok' };
  }

  @Get('users/:userId/meals')
  async listMeals(
    @Param('userId') userId: string,
    @Req() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<MealEntry[]> {
    this.svc.ensureAccess(req?.user?.id || userId, userId, roleFrom(req));
    return this.svc.listMeals(userId, from, to);
  }

  @Post('users/:userId/meals')
  async addMeal(@Param('userId') userId: string, @Body() entry: MealEntry, @Req() req: any) {
    this.svc.ensureAccess(req?.user?.id || userId, userId, roleFrom(req));
    await this.svc.addMealEntry(userId, entry);
    return { status: 'created' };
  }

  @Get('users/:userId/macros')
  async macros(
    @Param('userId') userId: string,
    @Query('date') date: string,
    @Req() req: any,
  ): Promise<MacroTargets> {
    this.svc.ensureAccess(req?.user?.id || userId, userId, roleFrom(req));
    return this.svc.computeDailyMacros(userId, date);
  }
}
