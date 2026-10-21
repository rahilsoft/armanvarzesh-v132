import { IsInt, Min, IsString, Length, IsOptional, Matches } from 'class-validator';

/**
 * HTTP body of `POST /payments`. It carries no payer id: the controller takes the
 * user only from the verified JWT.
 */
export class CreatePaymentBodyDto {
  @IsInt() @Min(1) amountCents!: number;
  @IsString() @Length(3, 3) @Matches(/^[A-Za-z]{3}$/) currency!: string;
  @IsOptional() @IsString() @Matches(/^[A-Za-z0-9._-]{1,64}$/) idempotencyKey?: string;
}

/** Internal command (use case input): userId is filled server-side from the JWT. */
export class CreatePaymentDto extends CreatePaymentBodyDto {
  @IsString() userId!: string;
}
