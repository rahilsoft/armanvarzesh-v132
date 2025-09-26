
import { Module, Global } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ScoringModule } from '../scoring/scoring.module';

@Global()
@Module({
  imports:[ScoringModule],
  providers:[JobsService],
  exports:[JobsService]
})
export class JobsModule {}
