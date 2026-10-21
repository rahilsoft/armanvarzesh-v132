import { Controller, Get, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MatchingService } from './matching.service';
import { PublicCoach, toPublicCoach } from '../coaches/entities/coach.entity';
import { CoachesService } from '../coaches/coaches.service';
import { ReviewsService } from '../reviews/reviews.service';

/**
 * REST controller exposing a simple HTTP endpoint for retrieving
 * recommended experts.  Accepts optional query parameters ``expertise``
 * and ``limit``.  If expertise is one of [package, full, complete, all]
 * the response will contain one expert per domain.
 */
@UseGuards(JwtAuthGuard)
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
    @Query('goals') goals?: string,
  ): Promise<PublicCoach[]> {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const goalList = goals ? goals.split(',').map((g) => g.trim()).filter(Boolean) : [];
    const coaches = await this.matchingService.recommend(expertise, parsedLimit, goalList);
    return coaches.map(toPublicCoach);
  }

  /**
   * Retrieve a single coach by ID along with their average rating.
   * Returns `null` if no coach exists with the given ID.
   */
  @Get('coach/:id')
  async getCoach(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ coach: PublicCoach | null; avgRating: number | null }> {
    const coach = await this.coachesService.findOne(id);
    if (!coach || !coach.verified) {
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
    return { coach: toPublicCoach(coach), avgRating };
  }
}