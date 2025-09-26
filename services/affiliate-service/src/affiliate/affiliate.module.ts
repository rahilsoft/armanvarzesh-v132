import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { AffiliateResolver } from './affiliate.resolver';

@Module({
  providers: [AffiliateService, AffiliateResolver],
})
export class AffiliateModule {}