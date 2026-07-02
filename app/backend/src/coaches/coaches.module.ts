
import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesResolver } from './coaches.resolver';
import { PrismaService } from '../database/prisma.service';
import { SpecialistScoringService, SpecialistMetricSources, CanonicalMetricSources } from './specialist-scoring.service';

@Module({
  providers: [
    CoachesService, CoachesResolver, PrismaService,
    SpecialistScoringService,
    { provide: SpecialistMetricSources, useClass: CanonicalMetricSources },
  ],
  exports: [CoachesService, SpecialistScoringService]
})
export class CoachesModule {}
