
import { Module } from '@nestjs/common';
import { ExperimentsService } from './experiments.service';
import { ExperimentsResolver } from './experiments.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [ExperimentsService, ExperimentsResolver, PrismaService],
  exports: [ExperimentsService]
})
export class ExperimentsModule {}
