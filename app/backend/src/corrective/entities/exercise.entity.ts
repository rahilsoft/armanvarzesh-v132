import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of a corrective exercise.  Fields can be
 * expanded over time without breaking existing clients.
 */
@ObjectType()
export class CorrectiveExercise {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;
}