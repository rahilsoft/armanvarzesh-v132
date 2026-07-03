import { User } from '../../users/entities/user.entity';
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Workout {
  @Field(() => Int)
  id!: number;

  @Field(() => Int, { nullable: true })
  userId!: number | null;

  @Field(() => Int, { nullable: true })
  planId?: number | null;

  @Field()
  title!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date!: Date | null;

  @Field(() => Int, { nullable: true })
  duration!: number | null;

  @Field(() => Int, { nullable: true })
  sets!: number | null;

  @Field(() => Int, { nullable: true })
  reps!: number | null;

  // rpe is a Float column (e.g. 7.5) — Number maps to GraphQL Float.
  @Field(() => Number, { nullable: true })
  rpe!: number | null;

  @Field(() => String, { nullable: true })
  notes!: string | null;

  @Field(() => String, { nullable: true })
  mediaUrl!: string | null;

  @Field(() => Number, { nullable: true })
  weight!: number | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
  @Field(() => User, { nullable: true })
  user?: User | null;
}
