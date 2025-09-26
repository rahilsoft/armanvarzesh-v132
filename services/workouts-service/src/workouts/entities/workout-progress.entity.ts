import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

/**
 * Aggregated statistics about a user's workouts. Provides a high-level
 * overview of progress across all logged sessions.
 */
@ObjectType()
export class WorkoutProgress {
  @Field(() => Int)
  totalWorkouts: number;

  @Field(() => Float)
  totalVolume: number;

  @Field(() => Float, { nullable: true })
  averageRpe?: number;
}