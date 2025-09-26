import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

/**
 * REST controller providing endpoints to retrieve and submit
 * expert reviews.  Clients can fetch all reviews for a given
 * expert via GET and submit a new review via POST.
 */
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Return all reviews for the specified expert ID.
   */
  @Get('expert/:id')
  getByExpert(
    @Param('id', ParseIntPipe) id: number,
  ): Review[] {
    return this.reviewsService.findByExpert(id);
  }

  /**
   * Submit a new review for the specified expert.  Request body
   * should contain `rating` and optionally `comment`.  Returns the
   * created review.
   */
  @Post('expert/:id')
  addReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { rating: number; comment?: string },
  ): Review {
    const rating = Number(body.rating);
    const comment = body.comment;
    return this.reviewsService.create(id, rating, comment);
  }
}