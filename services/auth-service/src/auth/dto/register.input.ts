import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/**
 * Input arguments required to register a new user. Includes
 * demographic fields for profile completion. Password is required
 * and will be hashed before storage.
 */
@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  role?: string;

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