import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';

/**
 * Assessments domain (structured assessments + JSON scoring rule engine).
 * Folded from services/assessments-service per the ownership map.
 * Independently extractable module (ADR-B1/B8).
 */
@Module({
  providers: [PrismaService, AssessmentsService],
  controllers: [AssessmentsController],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
