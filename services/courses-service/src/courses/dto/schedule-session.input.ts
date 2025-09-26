import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

@InputType()
export class ScheduleSessionInput {
  @Field(() => Int)
  @IsInt()
  courseId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  date: Date;

  @Field(() => Int)
  @IsInt()
  durationMinutes: number;
}