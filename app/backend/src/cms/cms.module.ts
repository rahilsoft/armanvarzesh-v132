
import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsResolver } from './cms.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [CmsService, CmsResolver, PrismaService],
  exports: [CmsService]
})
export class CmsModule {}
