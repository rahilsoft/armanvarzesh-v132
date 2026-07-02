import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PhysioService } from './physio.service';
import { PhysioController } from './physio.controller';

/**
 * Physio domain (rehab protocols, sessions, VAS pain and ROM tracking).
 * Folded from services/physio-service per the ownership map; content-service
 * Corrective* models join at the content dismemberment phase. Independently
 * extractable module: exports + /physio REST routes only (ADR-B1/B8).
 */
@Module({
  providers: [PrismaService, PhysioService],
  controllers: [PhysioController],
  exports: [PhysioService],
})
export class PhysioModule {}
