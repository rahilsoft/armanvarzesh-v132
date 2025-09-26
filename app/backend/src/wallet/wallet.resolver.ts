
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { WalletInput } from './dto/wallet.input';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Query(() => Wallet, { nullable: true })
  async wallet(@Args('userId', { type: () => Int }) userId: number) {
    return this.walletService.findOne(userId);
  }

  @Mutation(() => Wallet)
  async addCredit(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('amount', { type: () => Int }) amount: number
  ) {
    return this.walletService.addCredit(userId, amount);
  }

  @Mutation(() => Wallet)
  async withdraw(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('amount', { type: () => Int }) amount: number
  ) {
    return this.walletService.withdraw(userId, amount);
  }
}
