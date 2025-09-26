import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { Coach } from '../coaches/entities/coach.entity';
import { CoachesService } from '../coaches/coaches.service';
import { ReviewsService } from '../reviews/reviews.service';

/**
 * REST controller exposing a simple HTTP endpoint for retrieving
 * recommended experts.  Accepts optional query parameters ``expertise``
 * and ``limit``.  If expertise is one of [package, full, complete, all]
 * the response will contain one expert per domain.
 */
@Controller('matching')
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly coachesService: CoachesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get('recommend')
  async recommend(
    @Query('expertise') expertise?: string,
    @Query('limit') limit?: string,
  ): Promise<Coach[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.matchingService.recommend(expertise, parsedLimit);
  }

  /**
   * Retrieve a single coach by ID along with their average rating.
   * Returns `null` if no coach exists with the given ID.
   */
  @Get('coach/:id')
  async getCoach(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ coach: Coach | null; avgRating: number | null }> {
    const coach = await this.coachesService.findOne(id);
    if (!coach) {
      return { coach: null, avgRating: null };
    }
    // Compute average rating
    const reviews = this.reviewsService.findByExpert(id);
    let avgRating = null;
    if (reviews && reviews.length > 0) {
      avgRating =
        reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        reviews.length;
    }
    return { coach, avgRating };
  }
}