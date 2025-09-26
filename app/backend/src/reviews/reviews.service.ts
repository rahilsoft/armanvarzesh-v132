import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';

/**
 * Service providing in-memory storage and retrieval of expert
 * reviews.  Reviews enable users to rate experts, leaving
 * feedback that can later be incorporated into matching
 * algorithms.  In a real implementation these would be stored in
 * a persistent database and joined against experts via foreign
 * keys.
 */
@Injectable()
export class ReviewsService {
  private reviews: Review[] = [];

  /**
   * Retrieve all reviews left for a particular expert.
   *
   * @param expertId The identifier of the expert being reviewed.
   * @returns An array of Review objects (may be empty).
   */
  findByExpert(expertId: number): Review[] {
    return this.reviews.filter((r) => r.expertId === expertId);
  }

  /**
   * Create a new review entry.  Generates a new ID and stores the
   * review in-memory.
   *
   * @param expertId The identifier of the expert being reviewed.
   * @param rating The numeric rating (1–5).
   * @param comment Optional comment text.
   * @returns The created Review object.
   */
  create(
    expertId: number,
    rating: number,
    comment?: string,
  ): Review {
    const nextId = this.reviews.length
      ? Math.max(...this.reviews.map((r) => r.id)) + 1
      : 1;
    const review: Review = { id: nextId, expertId, rating, comment };
    this.reviews.push(review);
    return review;
  }
}