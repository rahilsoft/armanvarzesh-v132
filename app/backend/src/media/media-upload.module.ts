import { Module } from '@nestjs/common';
import { MediaUploadController } from './media-upload.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { InfraModule } from '../infra/infra.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [InfraModule],
  controllers: [MediaUploadController],
  providers: [MediaService, MediaRepository, PrismaService],
  exports: [MediaService]
})
export class MediaUploadModule {}
