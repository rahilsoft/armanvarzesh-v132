import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionResolver } from './nutrition.resolver';
import { PrismaService } from '../database/prisma.service';
import { CalculatorController } from './controllers/calculator.controller';
import { FoodController } from './controllers/food.controller';
import { PlanController } from './controllers/plan.controller';
import { PlansService } from './plans.service';

@Module({
  providers: [NutritionService, NutritionResolver, PrismaService, PlansService],
  controllers: [CalculatorController, FoodController, PlanController],
  exports: [NutritionService, PlansService],
})
export class NutritionModule {}
