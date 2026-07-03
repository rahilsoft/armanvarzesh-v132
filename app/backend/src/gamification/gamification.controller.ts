import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { RewardsService } from './rewards.service';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

/** Canonical REST surface for the Gamification domain (folded from
 *  challenges/rewards/vip/affiliate services). User identity comes from the
 *  JWT; self-scoped routes never trust a client-supplied user id. */

class IngestEventDto {
  @IsString() @MinLength(1) type!: string;
  @IsInt() amount!: number;
  @IsOptional() @IsObject() meta?: Record<string, unknown>;
  @IsString() @MinLength(1) idempotencyKey!: string;
}

class ClaimBadgeDto {
  @IsInt() badgeId!: number;
}

class UseReferralDto {
  @IsString() @MinLength(2) code!: string;
}

class CreateChallengeDto {
  @IsString() @MinLength(1) name!: string;
  @IsString() description!: string;
  @Type(() => Date) @IsDate() startAt!: Date;
  @Type(() => Date) @IsDate() endAt!: Date;
  @IsOptional() @IsObject() rules?: Record<string, unknown>;
  @IsOptional() @IsObject() reward?: Record<string, unknown>;
}

class AddPointsDto {
  @IsInt() userId!: number;
  @IsInt() points!: number;
  @IsOptional() @IsObject() progress?: Record<string, unknown>;
}

@Controller('gamification')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class GamificationController {
  constructor(
    private readonly rewards: RewardsService,
    private readonly challenges: ChallengesService,
  ) {}

  /*** Rewards / VIP / Referrals ***/

  @Get('rewards')
  myRewards(@CurrentUser() user: AuthPrincipal) {
    return this.rewards.myRewards(user.userId);
  }

  @Get('vip')
  vipStatus(@CurrentUser() user: AuthPrincipal) {
    return this.rewards.myVipStatus(user.userId);
  }

  @Post('events')
  ingest(@CurrentUser() user: AuthPrincipal, @Body() dto: IngestEventDto) {
    return this.rewards.ingestEvent(user.userId, dto.type, dto.amount, dto.meta as Prisma.InputJsonValue | undefined, dto.idempotencyKey);
  }

  @Post('badges/claim')
  claimBadge(@CurrentUser() user: AuthPrincipal, @Body() dto: ClaimBadgeDto) {
    return this.rewards.claimBadge(user.userId, dto.badgeId);
  }

  @Post('referrals')
  createReferral(@CurrentUser() user: AuthPrincipal) {
    return this.rewards.createReferral(user.userId);
  }

  @Post('referrals/use')
  useReferral(@CurrentUser() user: AuthPrincipal, @Body() dto: UseReferralDto) {
    return this.rewards.useReferral(dto.code, user.userId);
  }

  @Post('commissions/payout')
  payout(@CurrentUser() user: AuthPrincipal) {
    return this.rewards.payoutCommission(user.userId);
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

  @Public()
  @Get('challenges')
  listChallenges(@Query('activeAt') activeAt?: string) {
    return this.challenges.listChallenges(activeAt ? new Date(activeAt) : undefined);
  }

  @Post('challenges/:id/join')
  join(@CurrentUser() user: AuthPrincipal, @Param('id', ParseIntPipe) id: number) {
    return this.challenges.joinChallenge(id, user.userId);
  }

  @Post('challenges/:id/points')
  addPoints(@Param('id', ParseIntPipe) id: number, @Body() dto: AddPointsDto) {
    return this.challenges.addPoints(id, dto.userId, dto.points, dto.progress as Prisma.InputJsonValue | undefined);
  }

  @Public()
  @Get('challenges/:id/leaderboard')
  leaderboard(@Param('id', ParseIntPipe) id: number) {
    return this.challenges.leaderboard(id);
  }
}
