
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateCoachInput {
  @Field() @IsEmail()
  email: string;

  @Field() @IsString()
  name: string;

  @Field()
  expertise: string;
}
