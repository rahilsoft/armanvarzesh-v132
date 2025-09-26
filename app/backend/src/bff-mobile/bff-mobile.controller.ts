import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('bff-mobile')
export class BffMobileController {
  constructor(private prisma: PrismaService) {}
  @Get('dashboard')
  async dashboard(@Query('userId') userId: string) {
    const [workouts, notifications] = await Promise.all([
      (this.prisma as any).workout.findMany({ where: { userId }, take: 3, orderBy: { date: 'desc' } }),
      (this.prisma as any).notification?.findMany?.({ where: { userId }, take: 5, orderBy: { createdAt: 'desc' } }) || []
    ]);
    return { recentWorkouts: workouts, notifications };
  }
}