import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('ContentItem')
export class ContentItemType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  url: string;

  @Field()
  type: string;

  @Field(() => Int)
  createdBy: number;

  @Field()
  createdAt: Date;
}