
import { Module } from '@nestjs/common';
import { NutritionResolver } from './nutrition.resolver';
import { NutritionService } from './nutrition.service';

@Module({
  providers:[NutritionResolver, NutritionService],
  exports:[NutritionService]
})
export class NutritionModule {}
