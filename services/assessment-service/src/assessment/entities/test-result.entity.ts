import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType('TestResult')
export class TestResultType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  testId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Float)
  score: number;

  @Field()
  recordedAt: Date;
}