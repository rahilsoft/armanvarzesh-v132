import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of an exercise. Mirrors the Prisma model.
 */
@ObjectType()
export class Exercise {
  @Field(() => ID)
  id: number;

  @Field()
  planId: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  sets?: number;

  @Field({ nullable: true })
  reps?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  rpe?: number;

  @Field({ nullable: true })
  restTime?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;
}