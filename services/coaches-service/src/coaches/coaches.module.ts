import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesResolver } from './coaches.resolver';
import { PrismaService } from '../database/prisma.service';

/**
 * Module bundling the coaches resolver and service. Provides
 * PrismaService so that the service can access the database.
 */
@Module({
  providers: [PrismaService, CoachesService, CoachesResolver],
  exports: [CoachesService]
})
export class CoachesModule {}