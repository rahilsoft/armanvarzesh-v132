
import { Controller, Get, Param } from '@nestjs/common';
import { NutritionService } from '../nutrition.service';

@Controller('meals')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<any[]> {
    return this.nutritionService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.nutritionService.findOne(String(id));
  }
}