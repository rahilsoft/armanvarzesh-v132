import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class JoinChallengeInput {
  @Field(() => Int)
  @IsInt()
  challengeId: number;

  @Field(() => Int)
  @IsInt()
  userId: number;
}