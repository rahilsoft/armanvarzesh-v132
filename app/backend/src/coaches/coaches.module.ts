
import { Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesResolver } from './coaches.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [CoachesService, CoachesResolver, PrismaService],
  exports: [CoachesService]
})
export class CoachesModule {}
