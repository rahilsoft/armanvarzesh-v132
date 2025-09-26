
import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringResolver } from './scoring.resolver';

@Module({
  providers:[ScoringService, ScoringResolver],
  exports:[ScoringService]
})
export class ScoringModule {}
