import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type CreateWorkoutDto = {
  userId: string;
  title: string;
  level: 'beginner'|'intermediate'|'advanced';
  goal: 'strength'|'hypertrophy'|'fatloss';
  equipment?: string[];
};

@Injectable()
export class WorkoutsService {
  private prisma = new PrismaClient();

  async list(q?: string) {
    return this.prisma.workout.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: q ? { title: { contains: q, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { exercise: true } } }
    });
  }

  async get(id: string) {
    const w = await this.prisma.workout.findUnique({ where: { id }, include: { items: { include: { exercise: true } } } });
    if (!w) throw new NotFoundException('Workout not found');
    return w;
  }

  async create(dto: CreateWorkoutDto) {
    // Pick exercises based on level, equipment and goal; choose balanced across muscles
    const pool = await this.prisma.exercise.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: {
        level: dto.level,
        AND: dto.equipment && dto.equipment.length ? dto.equipment.map(eq => ({ equipment: { has: eq } })) : undefined
      }
    });
    const muscles = ['chest','back','legs','shoulders','arms','core'];
    const byMuscle = new Map<string, any[]>();
    for (const m of muscles) byMuscle.set(m, []);
    for (const ex of pool) {
      const m = ex.muscle.toLowerCase();
      if (!byMuscle.has(m)) byMuscle.set(m, []);
      byMuscle.get(m)!.push(ex);
    }
    // Build items
    const repsByGoal = { strength: 5, hypertrophy: 10, fatloss: 15 } as any;
    const setsByGoal = { strength: 5, hypertrophy: 4, fatloss: 3 } as any;
    const restByGoal = { strength: 180, hypertrophy: 90, fatloss: 45 } as any;

    const items: any[] = [];
    let idx = 0;
    for (const m of muscles) {
      const list = byMuscle.get(m) || [];
      if (list.length === 0) continue;
      const ex = list[Math.floor(Math.random() * list.length)];
      items.push({
        exerciseId: ex.id,
        sets: setsByGoal[dto.goal],
        reps: repsByGoal[dto.goal],
        restSec: restByGoal[dto.goal],
        orderIdx: idx++,
      });
    }

    const workout = await this.prisma.workout.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        level: dto.level,
        goal: dto.goal,
        items: { create: items }
      },
      include: { items: true }
    });
    return workout;
  }

  async update(id: string, data: Partial<CreateWorkoutDto>) {
    await this.get(id);
    return this.prisma.workout.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.get(id);
    await this.prisma.workoutItem.deleteMany({ where: { workoutId: id } });
    await this.prisma.workout.delete({ where: { id } });
    return { ok: true };
  }
}