import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

/**
 * Admin-only availability slot input. class-validator decorators are required:
 * the global ValidationPipe uses forbidNonWhitelisted, which rejects
 * undecorated fields.
 */
@InputType()
export class CreateAvailabilityInput {
  @Field() @IsString() @Matches(/^[1-9]\d*$/, { message: 'coachId must be a positive integer id' }) coachId: string;
  @Field() @IsDate() start: Date;
  @Field() @IsDate() end: Date;
  @Field({ nullable: true }) @IsOptional() @IsString() @MaxLength(500) recurrence?: string;
}
