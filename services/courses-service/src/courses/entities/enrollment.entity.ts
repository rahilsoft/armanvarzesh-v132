import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType('CourseEnrollment')
export class EnrollmentType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  courseId: number;

  @Field(() => Int)
  userId: number;

  @Field()
  enrolledAt: Date;
}