import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { RewardsService } from './rewards.service';
import { ChallengesService } from './challenges.service';

/** Canonical REST surface for the Gamification domain (folded from
 *  challenges/rewards/vip/affiliate services). */

class IngestEventDto {
  @IsInt() userId!: number;
  @IsString() @MinLength(1) type!: string;
  @IsInt() amount!: number;
  @IsOptional() @IsObject() meta?: Record<string, unknown>;
  @IsString() @MinLength(1) idempotencyKey!: string;
}

class ClaimBadgeDto {
  @IsInt() userId!: number;
  @IsInt() badgeId!: number;
}

class UseReferralDto {
  @IsString() @MinLength(2) code!: string;
  @IsInt() inviteeId!: number;
}

class CreateChallengeDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() description!: string;
  @Type(() => Date) @IsDate() startAt!: Date;
  @Type(() => Date) @IsDate() endAt!: Date;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsObject() reward?: Record<string, unknown>;
}

class JoinChallengeDto {
  @IsInt() userId!: number;
}

class AddPointsDto {
  @IsInt() userId!: number;
  @IsInt() points!: number;
  @IsOptional() @IsObject() progress?: Record<string, unknown>;
}

@Controller('gamification')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class GamificationController {
  constructor(
    private readonly rewards: RewardsService,
    private readonly challenges: ChallengesService,
  ) {}

  /*** Rewards / VIP / Referrals ***/

  @Get('rewards/:userId')
  myRewards(@Param('userId', ParseIntPipe) userId: number) {
    return this.rewards.myRewards(userId);
  }

  @Get('vip/:userId')
  vipStatus(@Param('userId', ParseIntPipe) userId: number) {
    return this.rewards.myVipStatus(userId);
  }

  @Post('events')
  ingest(@Body() dto: IngestEventDto) {
    return this.rewards.ingestEvent(dto.userId, dto.type, dto.amount, dto.meta as Prisma.InputJsonValue | undefined, dto.idempotencyKey);
  }

  @Post('badges/claim')
  claimBadge(@Body() dto: ClaimBadgeDto) {
    return this.rewards.claimBadge(dto.userId, dto.badgeId);
  }

  @Post('referrals/:inviterId')
  createReferral(@Param('inviterId', ParseIntPipe) inviterId: number) {
    return this.rewards.createReferral(inviterId);
  }

  @Post('referrals/use')
  useReferral(@Body() dto: UseReferralDto) {
    return this.rewards.useReferral(dto.code, dto.inviteeId);
  }

  @Post('commissions/payout/:inviterId')
  payout(@Param('inviterId', ParseIntPipe) inviterId: number) {
    return this.rewards.payoutCommission(inviterId);
  }

  /*** Challenges ***/

  @Post('challenges')
  createChallenge(@Body() dto: CreateChallengeDto) {
    return this.challenges.createChallenge({
      ...dto,
      rules: dto.rules as Prisma.InputJsonValue | undefined,
      reward: dto.reward as Prisma.InputJsonValue | undefined,
    });
  }

  @Get('challenges')
  listChallenges(@Query('activeAt') activeAt?: string) {
    return this.challenges.listChallenges(activeAt ? new Date(activeAt) : undefined);
  }

  @Post('challenges/:id/join')
  join(@Param('id', ParseIntPipe) id: number, @Body() dto: JoinChallengeDto) {
    return this.challenges.joinChallenge(id, dto.userId);
  }

  @Post('challenges/:id/points')
  addPoints(@Param('id', ParseIntPipe) id: number, @Body() dto: AddPointsDto) {
    return this.challenges.addPoints(id, dto.userId, dto.points, dto.progress as Prisma.InputJsonValue | undefined);
  }

  @Get('challenges/:id/leaderboard')
  leaderboard(@Param('id', ParseIntPipe) id: number) {
    return this.challenges.leaderboard(id);
  }
}
