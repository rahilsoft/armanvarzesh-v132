import { Module } from '@nestjs/common';
import { CmsService } from './cms.service';
import { CmsResolver } from './cms.resolver';
import { CmsTilesService } from './tiles.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [
    CmsService, CmsResolver, PrismaService,
    // Folded from services/content-service (tiles/intake/flags/CRM/surveys).
    CmsTilesService,
  ],
  exports: [CmsService, CmsTilesService]
})
export class CmsModule {}
