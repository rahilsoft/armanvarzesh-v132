import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionResolver } from './nutrition.resolver';
import { PrismaService } from '../database/prisma.service';
import { CalculatorController } from './controllers/calculator.controller';
import { FoodController } from './controllers/food.controller';
import { PlanController } from './controllers/plan.controller';
import { PlansService } from './plans.service';
import { NutritionGoalsService } from './goals.service';
import { HydrationService } from './hydration.service';
import { HabitsService } from './habits.service';
import { NutritionTrackingController } from './controllers/tracking.controller';
import { WearablesController } from './controllers/wearables.controller';

@Module({
  providers: [
    NutritionService, NutritionResolver, PrismaService, PlansService,
    // Folded from services/nutrition-service (goals / hydration / habits).
    NutritionGoalsService, HydrationService, HabitsService,
  ],
  controllers: [
    CalculatorController, FoodController, PlanController,
    NutritionTrackingController, WearablesController,
  ],
  exports: [NutritionService, PlansService, NutritionGoalsService, HydrationService, HabitsService],
})
export class NutritionModule {}
