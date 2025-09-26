import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * GraphQL object type representing a recommended exercise for a user. Each
 * recommendation includes the exercise name, number of sets, repetitions
 * and an optional weight suggestion (0 for bodyweight exercises).
 */
@ObjectType()
export class WorkoutRecommendation {
  @Field()
  exerciseName: string;

  @Field(() => Int)
  sets: number;

  @Field(() => Int)
  reps: number;

  @Field(() => Int)
  weight: number;
}