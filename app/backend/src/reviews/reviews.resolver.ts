import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

/**
 * GraphQL resolver exposing queries and mutations for expert
 * reviews.  Allows clients to fetch all reviews for a given
 * expert and submit a new review.  All identifiers are integer
 * types in GraphQL schema.
 */
@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** Query all reviews for a given expert. */
  @Query(() => [Review], { name: 'reviewsForExpert' })
  getReviewsForExpert(
    @Args('expertId', { type: () => Int }) expertId: number,
  ): Review[] {
    return this.reviewsService.findByExpert(expertId);
  }

  /** Mutation to create a new review. */
  @Mutation(() => Review)
  createReview(
    @Args('expertId', { type: () => Int }) expertId: number,
    @Args('rating', { type: () => Int }) rating: number,
    @Args('comment', { nullable: true }) comment?: string,
  ): Review {
    return this.reviewsService.create(expertId, rating, comment);
  }
}