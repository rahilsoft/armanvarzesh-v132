import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentResolver } from './assessment.resolver';

@Module({
  providers: [AssessmentService, AssessmentResolver],
})
export class AssessmentModule {}