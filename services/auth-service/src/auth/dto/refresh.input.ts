import { InputType, Field } from '@nestjs/graphql';

/**
 * Input type for refreshing an access token. Requires the
 * previously-issued refresh token.
 */
@InputType()
export class RefreshInput {
  @Field()
  refreshToken: string;
}