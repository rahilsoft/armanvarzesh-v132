
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field() @IsEmail()
  email: string;

  @Field() @IsString()
  name: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  password?: string;

  /**
   * Optional demographic and profile fields used to personalise workout and
   * nutrition plans. These fields are not required on account creation
   * but can be supplied if known.
   */
  @Field({ nullable: true })
  age?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  goals?: string;

  @Field({ nullable: true })
  fitnessLevel?: string;
}
