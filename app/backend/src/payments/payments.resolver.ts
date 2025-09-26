
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { PaymentInput } from './dto/payment.input';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [Payment])
  async payments() {
    return this.paymentsService.findAll();
  }

  @Mutation(() => String)
  async createPayment(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('input') input: PaymentInput
  ) {
    return this.paymentsService.create(userId, input.amount, input.description, input.callbackUrl);
  }

  @Mutation(() => Boolean)
  async verifyPayment(
    @Args('authority') authority: string,
    @Args('amount', { type: () => Int }) amount: number
  ) {
    return this.paymentsService.verifyPayment(authority, amount);
  }
}
