
import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from '../leaderboard.service';
import { LeaderboardEntry } from '../entities/leaderboard.entity';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.getLeaderboard();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':userId')
  async getUserLeaderboard(@Param('userId') userId: number): Promise<LeaderboardEntry[]> {
    return this.leaderboardService.findByUser(Number(userId));
  }
}