import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
@Controller('bff-web')
export class BffWebController {
  constructor(private prisma: PrismaService) {}
/** @deprecated AUTO-MARKED (Stage19): GQL op 'userId' is unused per Stage 07 census. */
  @Get('home')
  async home(@Query('userId') userId: string) {
    const [user, workouts] = await Promise.all([
      (this.prisma as any).user.findUnique({ where: { id: userId } }),
      (this.prisma as any).workout.findMany({ where: { userId }, take: 5, orderBy: { date: 'desc' } }),
    ]);
    return { user: { id: user?.id, name: user?.name }, recentWorkouts: workouts };
  }
}