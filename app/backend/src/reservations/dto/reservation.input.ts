import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * The booking user is the authenticated principal, never an input field
 * (REV-20261022-01). class-validator decorators are required: the global
 * ValidationPipe uses forbidNonWhitelisted, which rejects undecorated fields.
 */
@InputType()
export class CreateReservationInput {
  @Field() @IsString() @IsNotEmpty() coachId: string;
  @Field() @IsString() @Matches(/^[1-9]\d*$/, { message: 'slotId must be a positive integer id' }) slotId: string;
}
