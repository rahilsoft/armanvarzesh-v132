import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('Course')
export class CourseType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int)
  coachId: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  createdAt: Date;
}