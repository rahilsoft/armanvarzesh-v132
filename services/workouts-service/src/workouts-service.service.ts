import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * REST-facing CRUD service for workout sessions, backed by the canonical
 * Prisma `Workout` model. The richer plan/exercise/progress API lives in
 * the GraphQL `WorkoutsModule`.
 */
@Injectable()
export class WorkoutsService {
  private prisma = new PrismaClient();

  async list(_q?: string) {
    return this.prisma.workout.findMany({
      take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,
      orderBy: { date: 'desc' },
    });
  }

  async get(id: string) {
    const w = await this.prisma.workout.findUnique({ where: { id: Number(id) } });
    if (!w) throw new NotFoundException('Workout not found');
    return w;
  }

  async create(dto: any) {
    return this.prisma.workout.create({
      data: {
        userId: Number(dto.userId),
        planId: dto.planId != null ? Number(dto.planId) : undefined,
        sets: dto.sets ?? undefined,
        reps: dto.reps ?? undefined,
        weight: dto.weight ?? undefined,
        rpe: dto.rpe ?? undefined,
        notes: dto.notes ?? undefined,
        mediaUrl: dto.mediaUrl ?? undefined,
      },
    });
  }

  async update(id: string, dto: any) {
    await this.get(id);
    const { userId, planId, ...rest } = dto ?? {};
    return this.prisma.workout.update({
      where: { id: Number(id) },
      data: {
        ...rest,
        ...(userId != null ? { userId: Number(userId) } : {}),
        ...(planId != null ? { planId: Number(planId) } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.get(id);
    await this.prisma.workout.delete({ where: { id: Number(id) } });
    return { ok: true };
  }
}
