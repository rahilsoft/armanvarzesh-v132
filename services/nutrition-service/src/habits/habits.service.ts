
import { Injectable } from '@nestjs/common';
import { PrismaClient, HabitType } from '@prisma/client';

type CreateHabitInput = {
  userId: number;
  type: HabitType;
  target: number;
  cadence: any;
  tz: string;
};

type LogHabitInput = {
  habitId: number;
  occurredAt: Date;
  value: number;
  meta?: any;
};

@Injectable()
export class HabitsService {
  private prisma = new PrismaClient();

  async createHabit(input: CreateHabitInput) {
    const habit = await this.prisma.habit.create({
      data: {
        userId: input.userId,
        type: input.type,
        target: input.target,
        cadence: input.cadence,
        tz: input.tz,
      },
    });
    return { ok: true, habit };
  }

  async logHabit(input: LogHabitInput) {
    const log = await this.prisma.habitLog.create({
      data: {
        habitId: input.habitId,
        occurredAt: input.occurredAt,
        value: input.value,
        meta: input.meta ?? {},
      },
      include: { habit: true },
    });
    return { ok: true, log };
  }

  async getToday(userId: number, now = new Date()) {
    // naive "today" by tz not applied here; expect caller to pass tz if needed
    const start = new Date(now); start.setHours(0,0,0,0);
    const end = new Date(now); end.setHours(23,59,59,999);
    const habits = await this.prisma.habit.findMany({ where: { userId, active: true } });
    const results = [];
    for (const h of habits) {
      const logs = await this.prisma.habitLog.findMany({
        where: { habitId: h.id, occurredAt: { gte: start, lte: end } },
        orderBy: { occurredAt: 'asc' },
      });
      const sum = logs.reduce((s, x) => s + (x.value || 0), 0);
      const progress = h.target ? Math.min(1, sum / h.target) : 0;
      results.push({ habit: h, sum, progress, logs });
    }
    return { userId, date: start.toISOString().slice(0,10), items: results };
  }
}
