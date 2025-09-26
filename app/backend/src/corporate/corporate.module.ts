
import { Module } from '@nestjs/common';
import { CorporateService } from './corporate.service';
import { CorporateResolver } from './corporate.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [CorporateService, CorporateResolver, PrismaService],
  exports: [CorporateService]
})
export class CorporateModule {}
