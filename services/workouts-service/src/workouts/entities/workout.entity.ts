import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of a workout session. Mirrors the Prisma
 * model.
 */
@ObjectType()
export class Workout {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  planId?: number;

  @Field()
  userId: number;

  @Field()
  date: Date;

  @Field({ nullable: true })
  sets?: number;

  @Field({ nullable: true })
  reps?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  rpe?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  mediaUrl?: string;

  @Field()
  createdAt: Date;
}