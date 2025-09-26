import { Module } from '@nestjs/common';
import { UploadsResolver } from './uploads.resolver';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [UploadsResolver],
})
export class UploadsModule {}
