import { Module } from '@nestjs/common';
import { CoachesModule } from '../coaches/coaches.module';
import { MatchingService } from './matching.service';
import { MatchingResolver } from './matching.resolver';
import { MatchingController } from './matching.controller';
import { ReviewsModule } from '../reviews/reviews.module';

/**
 * The MatchingModule wires together the services and resolvers that power
 * the smart onboarding and expert recommendation functionality.  This
 * feature is mirrored from the root project into the project copy to
 * keep both versions consistent.  See the root implementation for
 * further documentation.
 */
@Module({
  imports: [CoachesModule, ReviewsModule],
  providers: [MatchingService, MatchingResolver],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}