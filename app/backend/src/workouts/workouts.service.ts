import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

/** Structured workout-session fields (canonical columns, folded from the
 *  former services/workouts-service). `data` remains for legacy payloads. */
export interface WorkoutWriteInput {
  title?: string;
  userId?: number;
  planId?: number;
  date?: Date;
  duration?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  rpe?: number;
  notes?: string;
  mediaUrl?: string;
  data?: Prisma.InputJsonValue;
}

/** Keep only defined, known columns — never forward arbitrary keys to Prisma. */
function pickWorkoutFields(input: WorkoutWriteInput): Partial<WorkoutWriteInput> {
  const out: Partial<WorkoutWriteInput> = {};
  const keys: (keyof WorkoutWriteInput)[] = [
    'title', 'userId', 'planId', 'date', 'duration',
    'sets', 'reps', 'weight', 'rpe', 'notes', 'mediaUrl', 'data',
  ];
  for (const k of keys) {
    if (input[k] !== undefined) (out as Record<string, unknown>)[k] = input[k];
  }
  return out;
}

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: WorkoutWriteInput & { title: string }) {
    // Pre-fold, the structured fields were stuffed into the `data` JSON blob
    // because the columns did not exist; they are now real columns.
    return this.prisma.workout.create({
      data: { ...pickWorkoutFields(data), title: data.title } as Prisma.WorkoutUncheckedCreateInput,
    });
  }

  async update(id: number, data: Partial<WorkoutWriteInput>) {
    return this.prisma.workout.update({
      where: { id },
      data: pickWorkoutFields(data) as Prisma.WorkoutUncheckedUpdateInput,
    });
  }

  async remove(id: number) {
    await this.prisma.workout.delete({ where: { id } });
    return { ok: true };
  }

  async findOne(id: number) {
    return this.prisma.workout.findUniqueOrThrow({ where: { id } });
  }

  async findByUser(userId: number) {
    return this.prisma.workout.findMany({ take: Number(process.env.API_DEFAULT_PAGE_SIZE) || 20,  where: { userId } });
  }

  /** Alias for findByUser(), used by the GraphQL resolver. */
  async findAllByUser(userId: number) {
    return this.findByUser(userId);
  }

  async findAll() {
    return this.prisma.workout.findMany();
  }

  /** Alias for remove(), used by the GraphQL resolver. */
  async delete(id: number) {
    return this.remove(id);
  }

  /**
   * Record the actual performance data for a workout by merging it into the
   * workout's JSON `data` field under an `actual` key.
   */
  async logActual(id: number, input: Partial<WorkoutWriteInput> | null) {
    const existing = await this.prisma.workout.findUniqueOrThrow({ where: { id } });
    const current =
      existing.data && typeof existing.data === 'object' && !Array.isArray(existing.data)
        ? (existing.data as Record<string, unknown>)
        : {};
    return this.prisma.workout.update({
      where: { id },
      data: { data: { ...current, actual: input ?? null } as Prisma.InputJsonValue },
    });
  }
}
