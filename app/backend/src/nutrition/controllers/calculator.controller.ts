import { Body, Controller, Post } from '@nestjs/common';
import { NutritionService } from '../nutrition.service';

/**
 * REST controller exposing nutritional calculations.  Provides a
 * single endpoint for computing BMR, TDEE and macronutrient
 * breakdown based on user attributes such as weight, height and
 * activity level.  This allows the front‑end to generate
 * personalised diet plans without requiring full persistence.
 */
@Controller('nutrition')
export class CalculatorController {
  constructor(private readonly nutritionService: NutritionService) {}

  /**
   * Calculate a nutrition plan.  Expects an object with
   * ``weight`` (kg), ``height`` (cm), ``age`` (years), ``gender``
   * ('male'|'female') and ``activityLevel`` ('sedentary'|'light'|'moderate'|'active'|'very').
   * Returns the BMR, TDEE and macro breakdown.  In case of
   * malformed input NestJS will return a 400 automatically.
   */
  @Post('calculate')
  calculate(@Body() body: {
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
  }) {
    return this.nutritionService.calculatePlan(body);
  }
}