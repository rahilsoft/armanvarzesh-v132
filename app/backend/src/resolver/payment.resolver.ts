import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from '../service/payment.service';
import { PaymentInput } from '../dto/payment.input';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => String)
  async initiatePayment(@Args('input') input: PaymentInput) {
    const result = await this.paymentService.makePayment(input);
    return result.paymentUrl;
  }

  @Mutation(() => Boolean)
  async verifyPayment(@Args('authority') authority: string, @Args('amount') amount: number) {
    const result = await this.paymentService.verifyPayment(authority, amount);
    return result.success;
  }
}
