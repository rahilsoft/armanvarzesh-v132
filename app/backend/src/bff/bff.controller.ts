import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('bff')
export class BffController {
  constructor(private prisma: PrismaService) {}
  // Aggregate few quick stats for dashboard in one request
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, upcoming, notifications] = await Promise.all([
      (this.prisma as any).workout.count({ where: { userId } }),
      (this.prisma as any).session?.findMany?.({ where: { userId, date: { gte: new Date() } }, take: 5 }) ?? [],
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5 }) ?? [],
    ]);
    return { workouts, upcoming, notifications };
  }
}