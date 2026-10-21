
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [Payment])
  async payments() {
    return this.paymentsService.findAll();
  }

  @Mutation(() => Boolean)
  async verifyPayment(
    @Args('authority') authority: string,
    @Args('status') status: string,
    @Args('amount', { type: () => Int, nullable: true }) amount?: number
  ) {
    // Status is required (no default): a missing or non-OK status is rejected.
    const res = await this.paymentsService.verifyPayment(authority, amount ?? undefined, status);
    return res.ok;
  }
}
