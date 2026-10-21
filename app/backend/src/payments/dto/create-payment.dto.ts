import { IsInt, Min, Max, IsString, Length, IsOptional, Matches } from 'class-validator';
import { MAX_PAYMENT_AMOUNT_RIAL, MIN_PAYMENT_AMOUNT_RIAL } from './amount-bounds';

/**
 * HTTP body of `POST /payments`. It carries no payer id: the controller takes the
 * user only from the verified JWT.
 */
export class CreatePaymentBodyDto {
  /** Integer amount in Rial (see amount-bounds.ts). */
  @IsInt() @Min(MIN_PAYMENT_AMOUNT_RIAL) @Max(MAX_PAYMENT_AMOUNT_RIAL) amountCents!: number;
  @IsString() @Length(3, 3) @Matches(/^[A-Za-z]{3}$/) currency!: string;
  @IsOptional() @IsString() @Matches(/^[A-Za-z0-9._-]{1,64}$/) idempotencyKey?: string;
}

/** Internal command (use case input): userId is filled server-side from the JWT. */
export class CreatePaymentDto extends CreatePaymentBodyDto {
  @IsString() userId!: string;
}
