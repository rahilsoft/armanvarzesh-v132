import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Exercise } from './exercise.entity';
import { Workout } from './workout.entity';

/**
 * GraphQL object representing a workout plan. Includes optional
 * relationships to exercises and workouts performed from this plan.
 */
@ObjectType()
export class WorkoutPlan {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  userId?: number;

  @Field()
  createdAt: Date;

  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[];

  @Field(() => [Workout], { nullable: true })
  workouts?: Workout[];
}