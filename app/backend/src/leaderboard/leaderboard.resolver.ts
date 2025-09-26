import { User } from '../users/entities/user.entity';
import { PrismaService } from '../database/prisma.service';
import { LoaderFactory } from '@arman/graphql-dataloader';

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResolveField, Parent } from '@nestjs/graphql';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardEntry } from './entities/leaderboard.entity';
import { LeaderboardInput } from './dto/leaderboard.input';

@Resolver(() => LeaderboardEntry)
export class LeaderboardResolver {
  constructor(private readonly leaderboardService: LeaderboardService, private readonly prisma: PrismaService, private readonly loaderFactory: LoaderFactory) {}

  private readonly userById = this.loaderFactory.create<number, any>(async (ids) => {
    const users = await this.prisma.user.findMany({ where: { id: { in: ids as number[] } } });
    const map = new Map(users.map(u => [u.id, u]));
    return (ids as number[]).map(id => map.get(id) ?? null);
  });
@Query(() => [LeaderboardEntry])
  async leaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Query(() => [LeaderboardEntry])
  async leaderboardByUser(@Args('userId', { type: () => Int }) userId: number) {
    return this.leaderboardService.findByUser(userId);
  }

  @Mutation(() => LeaderboardEntry)
  async addLeaderboardEntry(@Args('input') input: LeaderboardInput) {
    return this.leaderboardService.addEntry(input);
  }

  /**
   * Remove a leaderboard entry by its ID. Returns true if removed.
   */
  @Mutation(() => Boolean)
  async deleteLeaderboardEntry(@Args('id', { type: () => Int }) id: number) {
    return this.leaderboardService.delete(id);
  }
}

@ResolveField(() => User, { name: 'user', nullable: true })
user(@Parent() item: LeaderboardEntry) {
  return this.userById.load(item.userId);
}
