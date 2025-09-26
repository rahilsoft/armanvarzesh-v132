import { Module } from '@nestjs/common';
import { PredictiveService } from './predictive.service';
import { PredictiveResolver } from './predictive.resolver';

@Module({
  providers: [PredictiveService, PredictiveResolver],
})
export class PredictiveModule {}