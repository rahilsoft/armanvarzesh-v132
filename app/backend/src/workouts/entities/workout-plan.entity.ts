import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Exercise } from './exercise.entity';
import { Workout } from './workout.entity';

@ObjectType()
export class WorkoutPlan {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Int, { nullable: true })
  userId!: number | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => [Exercise], { nullable: true })
  exercises?: Exercise[];

  @Field(() => [Workout], { nullable: true })
  workouts?: Workout[];
}
