import { Controller, Get, Post, Body } from '@nestjs/common';
import { NutritionService } from '../nutrition.service';

/**
 * REST controller for managing foods in the nutrition module.
 * Exposes endpoints to list foods and create new ones.  Uses the
 * underlying NutritionService to interact with the database via
 * Prisma.
 */
@Controller('nutrition/foods')
export class FoodController {
  constructor(private readonly nutritionService: NutritionService) {}

  /**
   * Return a list of known foods.  Currently returns a maximum of
   * 100 items with no filtering or pagination.
   */
  @Get()
  async findAll() {
    return this.nutritionService.listFoods();
  }

  /**
   * Create a new food entry.  Expects properties such as title,
   * calories, protein, carbs and fat in the request body.
   */
  @Post()
  async create(@Body() body: any) {
    return this.nutritionService.createFood(body);
  }
}