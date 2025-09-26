import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('Test')
export class TestType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  unit: string;

  @Field(() => Int)
  createdBy: number;

  @Field()
  createdAt: Date;
}