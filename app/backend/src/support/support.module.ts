
import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportResolver } from './support.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [SupportService, SupportResolver, PrismaService],
  exports: [SupportService]
})
export class SupportModule {}
