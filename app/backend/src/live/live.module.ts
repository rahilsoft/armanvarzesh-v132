
import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveResolver } from './live.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [LiveService, LiveResolver, PrismaService],
  exports: [LiveService]
})
export class LiveModule {}
