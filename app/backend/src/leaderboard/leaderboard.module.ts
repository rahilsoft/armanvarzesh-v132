import { LoaderFactory } from '@arman/graphql-dataloader';

import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardResolver } from './leaderboard.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [ LoaderFactory, LeaderboardService, LeaderboardResolver, PrismaService],
  exports: [LeaderboardService]
})
export class LeaderboardModule {}
