import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipResolver } from './vip.resolver';

@Module({
  providers: [VipService, VipResolver],
})
export class VipModule {}