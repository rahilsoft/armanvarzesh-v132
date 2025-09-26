import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional } from 'class-validator';

/**
 * Input type used to create a user within the users microservice. This
 * definition mirrors the fields available on the User entity and
 * includes optional demographic attributes that can be used later for
 * personalisation of workout and nutrition plans. Validators are
 * applied where appropriate to ensure data integrity.
 */
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  role?: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  /**
   * Optional demographic and profile fields. These are not required
   * when initially creating a user but are provided here to allow
   * profile completion in a single request if desired.
   */
  @Field({ nullable: true })
  @IsOptional()
  age?: number;

  @Field({ nullable: true })
  @IsOptional()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  height?: number;

  @Field({ nullable: true })
  @IsOptional()
  weight?: number;

  @Field({ nullable: true })
  @IsOptional()
  goals?: string;

  @Field({ nullable: true })
  @IsOptional()
  fitnessLevel?: string;
}