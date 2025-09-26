import { ObjectType, Field } from '@nestjs/graphql';

/**
 * GraphQL object representing a pair of access and refresh tokens.
 */
@ObjectType()
export class AuthTokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}