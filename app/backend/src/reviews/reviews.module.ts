import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsResolver } from './reviews.resolver';

/**
 * Module encapsulating review storage and retrieval.  Exposes
 * REST and GraphQL providers for integration with the rest of
 * the application.
 */
@Module({
  providers: [ReviewsService, ReviewsResolver],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}