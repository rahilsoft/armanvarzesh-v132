import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Habit, HabitLog, HabitType } from '@prisma/client';

export interface CreateHabitInput {
  userId: number;
  type: HabitType;
  target: number;
  cadence: Prisma.InputJsonValue;
  tz: string;
}

export interface LogHabitInput {
  habitId: number;
  occurredAt: Date;
  value: number;
  meta?: Prisma.InputJsonValue;
}

export interface HabitTodayItem {
  habit: Habit;
  sum: number;
  progress: number;
  logs: HabitLog[];
}

export interface HabitsToday {
  userId: number;
  date: string;
  items: HabitTodayItem[];
}

/**
 * Habit/streak tracking (folded from services/nutrition-service). Behaviour-
 * preserving port with two fixes: the injected PrismaService replaces the
 * original's private `new PrismaClient()`, and getToday's per-habit query
 * loop (N+1) is collapsed into a single log query grouped in memory.
 */
@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createHabit(input: CreateHabitInput): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        userId: input.userId,
        type: input.type,
        target: input.target,
        cadence: input.cadence,
        tz: input.tz,
      },
    });
  }

  async logHabit(input: LogHabitInput): Promise<HabitLog & { habit: Habit }> {
    const habit = await this.prisma.habit.findUnique({ where: { id: input.habitId } });
    if (!habit) throw new NotFoundException('HABIT_NOT_FOUND');
    return this.prisma.habitLog.create({
      data: {
        habitId: input.habitId,
        occurredAt: input.occurredAt,
        value: input.value,
        meta: input.meta ?? {},
      },
      include: { habit: true },
    });
  }

  /** Today's progress per active habit (naive local-day window, as before). */
  async getToday(userId: number, now = new Date()): Promise<HabitsToday> {
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end = new Date(now); end.setHours(23, 59, 59, 999);
    const habits = await this.prisma.habit.findMany({ where: { userId, active: true } });
    const logs = habits.length
      ? await this.prisma.habitLog.findMany({
          where: { habitId: { in: habits.map((h) => h.id) }, occurredAt: { gte: start, lte: end } },
          orderBy: { occurredAt: 'asc' },
        })
      : [];
    const byHabit = new Map<number, HabitLog[]>();
    for (const l of logs) {
      const arr = byHabit.get(l.habitId) ?? [];
      arr.push(l);
      byHabit.set(l.habitId, arr);
    }
    const items: HabitTodayItem[] = habits.map((h) => {
      const hLogs = byHabit.get(h.id) ?? [];
      const sum = hLogs.reduce((s, x) => s + (x.value || 0), 0);
      const progress = h.target ? Math.min(1, sum / h.target) : 0;
      return { habit: h, sum, progress, logs: hLogs };
    });
    return { userId, date: start.toISOString().slice(0, 10), items };
  }
}
