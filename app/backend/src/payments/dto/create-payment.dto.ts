import { IsInt, Min, IsString, Length, IsOptional, Matches } from 'class-validator';

export class CreatePaymentDto {
  @IsString() userId!: string;
  @IsInt() @Min(1) amountCents!: number;
  @IsString() @Length(3, 3) @Matches(/^[A-Za-z]{3}$/) currency!: string;
  @IsOptional() @IsString() @Matches(/^[A-Za-z0-9._-]{1,64}$/) idempotencyKey?: string;
}
