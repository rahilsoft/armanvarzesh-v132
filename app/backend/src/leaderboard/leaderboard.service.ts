
import { Injectable } from '@nestjs/common';
import { LeaderboardEntry } from './entities/leaderboard.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async addEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): Promise<LeaderboardEntry> {
    return this.prisma.leaderboardEntry.create({ data: { userId: entry.userId, xp: entry.xp, calories: entry.calories, sessions: entry.sessions, timeframe: entry.timeframe, date: new Date() } });
  }
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    // Return entries sorted by XP in descending order
    return this.prisma.leaderboardEntry.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  orderBy: { xp: 'desc' } });
  }
  async findByUser(userId: number): Promise<LeaderboardEntry[]> {
    return this.prisma.leaderboardEntry.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { userId } });
  }

  /**
   * Delete a leaderboard entry by its ID. Returns true if removed, otherwise false.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.leaderboardEntry.delete({ where: { id } });
    return true;
  }
}
