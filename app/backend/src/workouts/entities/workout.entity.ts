import { User } from '../../users/entities/user.entity';
import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Workout {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

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

  @Field(() => Int, { nullable: true })
  rpe!: number | null;

  @Field({ nullable: true })
  notes!: string | null;

  @Field({ nullable: true })
  mediaUrl!: string | null;

  @Field(() => Number, { nullable: true })
  weight!: number | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
  @Field(() => User, { nullable: true })
  user?: User | null;
}
