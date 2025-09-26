import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class PaymentInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsNumber()
  @Min(1)
  amount: number;

  @Field()
  @IsString()
  method: string; // e.g., 'zarinpal', 'stripe'
}
