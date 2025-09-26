import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of the User record used by the auth service.
 * Mirrors the fields stored in the database. All profile fields are
 * nullable because they may not be set during initial registration.
 */
@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  age?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  goals?: string;

  @Field({ nullable: true })
  fitnessLevel?: string;

  @Field()
  createdAt: Date;
}