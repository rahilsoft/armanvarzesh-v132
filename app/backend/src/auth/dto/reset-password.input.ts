
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field() @IsEmail()
  email: string;

  @Field() @IsString() @MinLength(6)
  newPassword: string;

  @Field() @IsString()
  otp: string;
}
