import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Exercise {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  planId!: number;

  @Field()
  name!: string;

  @Field(() => Int, { nullable: true })
  sets!: number | null;

  @Field(() => Int, { nullable: true })
  reps!: number | null;

  @Field(() => Float, { nullable: true })
  weight!: number | null;

  @Field(() => Float, { nullable: true })
  rpe!: number | null;

  @Field(() => Int, { nullable: true })
  restTime!: number | null;

  @Field(() => String, { nullable: true })
  notes!: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
