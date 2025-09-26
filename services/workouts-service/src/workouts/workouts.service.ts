import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class WorkoutsService {
  private prisma = new PrismaClient();

  async list(q?: string) {
    return this.prisma.workout.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: q ? { OR: [{ title: { contains: q, mode: 'insensitive' }}, { goal: { contains: q, mode: 'insensitive' }}]} : {},
      include: { items: { include: { exercise: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    return this.prisma.workout.findUnique({
      where: { id },
      include: { items: { include: { exercise: true } } },
    });
  }

  async create(dto: {userId: string; title: string; level: 'beginner'|'intermediate'|'advanced'; goal: 'fatloss'|'strength'|'hypertrophy'; equipment?: string[]}) {
    // very simple planner: choose exercises by level/equipment/muscle spread
    const equipmentList = dto.equipment && dto.equipment.length ? dto.equipment : ['bodyweight','dumbbell','barbell','machine'];
    const all = await this.prisma.exercise.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20, 
      where: { level: dto.level, equipment: { in: equipmentList } }
    });
    // pick up to 6 exercises across muscles
    const byMuscle: Record<string, any[]> = {};
    for (const ex of all) {
      byMuscle[ex.muscle] = byMuscle[ex.muscle] || [];
      byMuscle[ex.muscle].push(ex);
    }
    const muscles = Object.keys(byMuscle).slice(0, 6);
    const chosen = muscles.map(m => byMuscle[m][0]).filter(Boolean);

    const repRange = dto.goal === 'strength' ? { sets: 5, reps: 5, rest: 120 }
                  : dto.goal === 'hypertrophy' ? { sets: 4, reps: 10, rest: 90 }
                  : { sets: 3, reps: 15, rest: 45 };

    const workout = await this.prisma.workout.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        level: dto.level,
        goal: dto.goal,
        items: {
          create: chosen.map((ex, idx) => ({
            exerciseId: ex.id,
            sets: repRange.sets,
            reps: repRange.reps,
            restSec: repRange.rest,
            orderIdx: idx+1
          }))
        }
      },
      include: { items: { include: { exercise: true } } },
    });
    return workout;
  }
}