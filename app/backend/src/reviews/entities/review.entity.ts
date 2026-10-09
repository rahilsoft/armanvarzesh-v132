import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Review {
  /** Unique identifier for the review */
  @Field(() => Int)
  id!: number;

  /** Identifier of the expert (coach, nutritionist or physiotherapist) being reviewed */
  @Field(() => Int)
  expertId!: number;

  /** Rating given by the reviewer (1–5) */
  @Field(() => Int)
  rating!: number;

  /** Optional textual comment accompanying the rating */
  @Field({ nullable: true })
  comment?: string;
}
