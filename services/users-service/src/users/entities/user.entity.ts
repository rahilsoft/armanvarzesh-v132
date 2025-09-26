import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * GraphQL representation of the User record. All properties except for
 * id, email and createdAt are nullable to reflect the fact that
 * profile information is optional. When more fields are added to the
 * Prisma model they should be mirrored here to expose them through
 * GraphQL.
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