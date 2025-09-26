import { Module } from '@nestjs/common';
import { MediaQueueService } from './mediaqueue.service';
import { MediaQueueResolver } from './mediaqueue.resolver';

@Module({
  providers: [MediaQueueService, MediaQueueResolver],
  exports: [MediaQueueService]
})
export class MediaQueueModule {}
