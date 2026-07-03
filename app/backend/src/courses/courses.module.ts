import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

/**
 * Courses/LMS domain (courses, encrypted assets, enrollments, verifiable
 * certificates). Folded from services/courses-service and
 * services/certificate-service per the ownership map. Independently
 * extractable module: exports + /courses REST routes only (ADR-B1/B8).
 */
@Module({
  providers: [PrismaService, CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
