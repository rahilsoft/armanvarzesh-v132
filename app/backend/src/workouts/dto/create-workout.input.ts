import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateWorkoutInput {
  @Field()
  title!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;

  @Field(() => Int, { nullable: true })
  duration?: number;

  // Optional planned metrics for the workout (sets, reps and weight)
  @Field(() => Int, { nullable: true })
  sets?: number;

  @Field(() => Int, { nullable: true })
  reps?: number;

  @Field(() => Number, { nullable: true })
  weight?: number;

  // Optional actual metrics recorded after the workout session
  @Field(() => Int, { nullable: true })
  rpe?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  mediaUrl?: string;
}
