import { Module } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { NutritionResolver } from './nutrition.resolver';
import { PrismaService } from '../database/prisma.service';

/**
 * Module for the nutrition microservice. Bundles the resolver and
 * service and provides the PrismaService.
 */
@Module({
  providers: [PrismaService, NutritionService, NutritionResolver],
  exports: [NutritionService]
})
export class NutritionModule {}