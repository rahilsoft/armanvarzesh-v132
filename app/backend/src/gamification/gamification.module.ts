import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RewardsService } from './rewards.service';
import { ChallengesService } from './challenges.service';
import { GamificationController } from './gamification.controller';

/**
 * Gamification domain (challenges, points, badges, streaks, VIP, referrals,
 * commissions). Folded from services/{challenges,rewards,vip,affiliate}-service
 * per the ownership map. Designed as an independently extractable module:
 * public surface is this module's exports + the /gamification REST routes;
 * no other domain imports its internals (strangler seam, ADR-B1/B8).
 */
@Module({
  providers: [PrismaService, RewardsService, ChallengesService],
  controllers: [GamificationController],
  exports: [RewardsService, ChallengesService],
})
export class GamificationModule {}
