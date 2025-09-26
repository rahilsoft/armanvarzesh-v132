import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { PaymentsService, Payment, Wallet } from './payments.service';

// GraphQL object types
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Payment')
export class PaymentType implements Payment {
  @Field(() => Int)
  id: number;
  @Field(() => Int)
  userId: number;
  @Field(() => Float)
  amount: number;
  @Field()
  status: 'pending' | 'completed' | 'cancelled';
  @Field()
  createdAt: Date;
}

@ObjectType('Wallet')
export class WalletType implements Wallet {
  @Field(() => Int)
  userId: number;
  @Field(() => Float)
  balance: number;
}

/**
 * Resolver exposing payment and wallet operations via GraphQL.
 */
@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [PaymentType])
  payments(@Args('userId', { type: () => Int }) userId: number) {
    return this.paymentsService.getPayments(userId);
  }

  @Mutation(() => PaymentType)
  createPayment(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('amount', { type: () => Float }) amount: number,
  ) {
    return this.paymentsService.createPayment(userId, amount);
  }

  @Mutation(() => PaymentType, { nullable: true })
  confirmPayment(@Args('id', { type: () => Int }) id: number) {
    return this.paymentsService.confirmPayment(id);
  }

  @Mutation(() => PaymentType, { nullable: true })
  cancelPayment(@Args('id', { type: () => Int }) id: number) {
    return this.paymentsService.cancelPayment(id);
  }

  @Query(() => WalletType)
  walletBalance(@Args('userId', { type: () => Int }) userId: number) {
    return this.paymentsService.getBalance(userId);
  }

  @Mutation(() => WalletType)
  deposit(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('amount', { type: () => Float }) amount: number,
  ) {
    return this.paymentsService.deposit(userId, amount);
  }

  @Mutation(() => WalletType)
  withdraw(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('amount', { type: () => Float }) amount: number,
  ) {
    return this.paymentsService.withdraw(userId, amount);
  }
}