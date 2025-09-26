
import { Module } from '@nestjs/common';
import { TilesPrismaService } from './tiles-prisma.service';
import { TilesPrismaResolver } from './tiles-prisma.resolver';
import { PreviewTokenResolver } from './preview-token.resolver';
import { AdminGuard } from './tiles.guard';

@Module({
  providers: [TilesPrismaService, TilesPrismaResolver, PreviewTokenResolver, AdminGuard],
  exports: [TilesPrismaService],
})
export class TilesPrismaModule {}
