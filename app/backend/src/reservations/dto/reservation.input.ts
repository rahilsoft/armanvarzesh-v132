import { InputType, Field } from '@nestjs/graphql';
import { IsString, Matches } from 'class-validator';

/**
 * The booking user is the authenticated principal, never an input field
 * (REV-20261022-01). class-validator decorators are required: the global
 * ValidationPipe uses forbidNonWhitelisted, which rejects undecorated fields.
 */
@InputType()
export class CreateReservationInput {
  // Checked server-side against the owner of the slot (REV-20261106-01).
  @Field() @IsString() @Matches(/^[1-9]\d*$/, { message: 'coachId must be a positive integer id' }) coachId: string;
  @Field() @IsString() @Matches(/^[1-9]\d*$/, { message: 'slotId must be a positive integer id' }) slotId: string;
}
