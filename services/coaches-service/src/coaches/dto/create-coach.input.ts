import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional } from 'class-validator';

/**
 * Input type for creating a new coach. Email and name are required;
 * other professional details are optional. Password can be supplied
 * if coaches need to authenticate separately; it is not hashed in
 * this microservice but could be handled by the auth service.
 */
@InputType()
export class CreateCoachInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  speciality?: string;

  @Field({ nullable: true })
  @IsOptional()
  certifications?: string;

  @Field({ nullable: true })
  @IsOptional()
  bio?: string;
}