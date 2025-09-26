import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('CourseSession')
export class SessionType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  courseId: number;

  @Field()
  title: string;

  @Field()
  date: Date;

  @Field(() => Int)
  durationMinutes: number;
}