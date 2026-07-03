import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';

/**
 * Medical domain (facilities, doctors, health tests, clinical appointments).
 * Folded from services/medical-service per the ownership map. Independently
 * extractable module: exports + /medical REST routes only (ADR-B1/B8).
 */
@Module({
  providers: [PrismaService, MedicalService],
  controllers: [MedicalController],
  exports: [MedicalService],
})
export class MedicalModule {}
