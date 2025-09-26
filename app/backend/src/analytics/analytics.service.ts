
import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { AnalyticsEntity } from './entities/analytics.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly cache: CacheService){}
  constructor(private prisma: PrismaService) {}

  async addKpi(userId: number, kpi: string, value: number): Promise<AnalyticsEntity> {
    return this.prisma.analyticsEntity.create({
      data: {
        userId,
        kpi,
        value,
        recordedAt: new Date()
      }
    });
  }
  async getKpis(userId: number): Promise<AnalyticsEntity[]> {
    return this.prisma.analyticsEntity.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { userId } });
  }

  /**
   * Update a KPI record. Only provided fields will be updated. Returns
   * the updated record or null if not found.
   */
  async update(id: number, input: Partial<AnalyticsEntity>): Promise<AnalyticsEntity> {
    return this.prisma.analyticsEntity.update({ where: { id }, data: { kpi: input.kpi, value: input.value } });
  }

  /**
   * Remove a KPI record by its ID. Returns true if removed, false otherwise.
   */
  async delete(id: number): Promise<boolean> {
    await this.prisma.analyticsEntity.delete({ where: { id } });
    return true;
  }
}
