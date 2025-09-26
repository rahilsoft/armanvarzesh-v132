
import { Module } from '@nestjs/common';
import { PushResolver } from './push.resolver';

@Module({
  providers:[PushResolver],
  exports:[]
})
export class NotificationsModule {}
