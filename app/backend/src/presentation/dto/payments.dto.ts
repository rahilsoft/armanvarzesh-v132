import { IsInt, Min, IsString, IsOptional, Max, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsInt() @Min(1) amountCents!: number;
  @IsString() currency!: string; // validated at usecase level too
  @IsOptional() @IsString() idempotencyKey?: string;
}

export class ListPaymentsQuery {
  @IsOptional() @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @IsString() cursor?: string;
}
