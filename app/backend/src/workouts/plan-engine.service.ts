import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Plan, PlanAssignment, PlanSession, PlanSetLog, PlanSessionNote, SessionStatus, Prisma } from '@prisma/client';

/**
 * Training-plan engine — plan structure (days/blocks/items/sets), assignment
 * with generated session schedules, set logging, notes and adherence. Folded
 * from services/content-service's 973-line plan resolver (dismemberment step
 * 2; cuid ids -> Int PKs). Two defects fixed in the port, both
 * regression-tested:
 *  1. generated sessions now carry `clientId` — the original created them
 *     without it, so adherence-by-client always counted 0 scheduled;
 *  2. session generation is computed in memory (one createMany) instead of a
 *     count+create query pair per calendar day.
 */

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_MS = 86_400_000;

export interface PlanSetInput { order: number; reps?: number; weight?: number; rest?: number; tempo?: string; rpe?: number; durationSec?: number; targetWeight?: number; targetRPE?: number }
export interface PlanItemInput { order: number; exerciseId: number; note?: string; sets?: PlanSetInput[] }
export interface PlanBlockInput { order: number; type?: 'SINGLE' | 'SUPERSET' | 'TRISET' | 'CIRCUIT'; section?: string; protocol?: string; protocolParams?: Prisma.InputJsonValue; rounds?: number; restBetweenItemsSec?: number; items?: PlanItemInput[] }
export interface PlanDayInput { order: number; title?: string; note?: string; blocks?: PlanBlockInput[] }
export interface CreatePlanInput { title: string; description?: string; kind?: 'WORKOUT' | 'CORRECTIVE' | 'NUTRITION'; ownerId?: number; createdBy?: number; days?: PlanDayInput[] }

/** Protocol parameter validation (ported verbatim from the resolver). */
export function validateProtocolParams(proto?: string, params?: Record<string, unknown>): void {
  if (!proto) return;
  const p = params ?? {};
  const U = String(proto).toUpperCase();
  if (U === '5X5' || U === 'FIVEXFIVE') { /* no params required */ }
  else if (U === 'GVT') { if (typeof p.sets !== 'number' || p.sets <= 0) throw new BadRequestException('GVT requires numeric sets'); }
  else if (U === 'EMOM') { if (typeof p.minutes !== 'number' || p.minutes <= 0) throw new BadRequestException('EMOM requires minutes'); }
  else if (U === 'HIIT') { if (typeof p.work !== 'number' || typeof p.rest !== 'number') throw new BadRequestException('HIIT requires work/rest seconds'); }
}

/** ISO-ish week key used to cap sessions per calendar week (ported). */
function weekKey(d: Date): string {
  const y = d.getUTCFullYear();
  const firstDay = new Date(Date.UTC(y, 0, 1));
  const week = Math.ceil(((d.getTime() - firstDay.getTime()) / DAY_MS + firstDay.getUTCDay() + 1) / 7);
  return `${y}-W${week}`;
}

@Injectable()
export class PlanEngineService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Plan structure ***/

  async createPlan(input: CreatePlanInput): Promise<Plan> {
    for (const day of input.days ?? []) {
      for (const block of day.blocks ?? []) {
        validateProtocolParams(block.protocol, block.protocolParams as Record<string, unknown> | undefined);
      }
    }
    return this.prisma.plan.create({
      data: {
        title: input.title,
        description: input.description,
        kind: input.kind,
        ownerId: input.ownerId,
        createdBy: input.createdBy,
        days: {
          create: (input.days ?? []).map((d) => ({
            order: d.order, title: d.title, note: d.note,
            blocks: {
              create: (d.blocks ?? []).map((b) => ({
                order: b.order, type: b.type, section: b.section,
                protocol: b.protocol, protocolParams: b.protocolParams,
                rounds: b.rounds, restBetweenItemsSec: b.restBetweenItemsSec,
                items: {
                  create: (b.items ?? []).map((it) => ({
                    order: it.order, exerciseId: it.exerciseId, note: it.note,
                    sets: { create: (it.sets ?? []).map((st) => ({ ...st })) },
                  })),
                },
              })),
            },
          })),
        },
      },
      include: { days: { include: { blocks: { include: { items: { include: { sets: true } } } } } } },
    });
  }

  async publishPlan(planId: number): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('PLAN_NOT_FOUND');
    return this.prisma.plan.update({ where: { id: planId }, data: { status: 'PUBLISHED', version: { increment: 1 } } });
  }

  getPlan(planId: number) {
    return this.prisma.plan.findUnique({
      where: { id: planId },
      include: { days: { orderBy: { order: 'asc' }, include: { blocks: { orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' }, include: { sets: { orderBy: { order: 'asc' } }, exercise: true } } } } } } },
    });
  }

  /*** Assignment & schedule generation ***/

  /**
   * Assign a plan to a client and generate the session schedule: iterate the
   * window day by day, skip rest days, cap `sessionsPerWeek` per calendar
   * week, cycle plan days by index.
   */
  async assignPlan(planId: number, clientId: number, startDate: Date, sessionsPerWeek: number, restDays: string[], durationDays: number): Promise<PlanAssignment & { sessions: PlanSession[] }> {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId }, include: { days: true } });
    if (!plan) throw new NotFoundException('PLAN_NOT_FOUND');
    if (!plan.days.length) throw new BadRequestException('PLAN_HAS_NO_DAYS');
    const assignment = await this.prisma.planAssignment.create({
      data: { planId, clientId, startDate, sessionsPerWeek, restDays, durationDays },
    });
    const sessions = this.computeSchedule(startDate, durationDays, sessionsPerWeek, restDays, plan.days.length)
      .map((s) => ({ ...s, assignmentId: assignment.id, clientId }));
    await this.prisma.planSession.createMany({ data: sessions });
    const created = await this.prisma.planSession.findMany({ where: { assignmentId: assignment.id }, orderBy: { date: 'asc' } });
    return { ...assignment, sessions: created };
  }

  /** Re-anchor an assignment: replace its schedule with a newly generated one. */
  async reassignPlanDates(assignmentId: number, startDate: Date, sessionsPerWeek: number, restDays: string[], durationDays: number): Promise<PlanAssignment> {
    const asg = await this.prisma.planAssignment.update({
      where: { id: assignmentId },
      data: { startDate, sessionsPerWeek, restDays, durationDays },
    });
    const plan = await this.prisma.plan.findUnique({ where: { id: asg.planId }, include: { days: true } });
    await this.prisma.planSession.deleteMany({ where: { assignmentId } });
    const sessions = this.computeSchedule(startDate, durationDays, sessionsPerWeek, restDays, plan?.days.length || 1)
      .map((s) => ({ ...s, assignmentId, clientId: asg.clientId }));
    await this.prisma.planSession.createMany({ data: sessions });
    return asg;
  }

  private computeSchedule(startDate: Date, durationDays: number, sessionsPerWeek: number, restDays: string[], planDayCount: number): { date: Date; dayIndex: number }[] {
    const out: { date: Date; dayIndex: number }[] = [];
    const end = new Date(startDate.getTime() + durationDays * DAY_MS);
    let cur = new Date(startDate);
    let idx = 0; let wk = ''; let createdThisWeek = 0;
    while (cur <= end) {
      const k = weekKey(cur);
      if (k !== wk) { wk = k; createdThisWeek = 0; }
      const dayName = DAY_NAMES[cur.getUTCDay()];
      if (!restDays.includes(dayName) && createdThisWeek < sessionsPerWeek) {
        out.push({ date: new Date(cur), dayIndex: idx % planDayCount });
        idx++; createdThisWeek++;
      }
      cur = new Date(cur.getTime() + DAY_MS);
    }
    return out;
  }

  /*** Session execution ***/

  async completeSession(sessionId: number): Promise<PlanSession> {
    const s = await this.prisma.planSession.findUnique({ where: { id: sessionId } });
    if (!s) throw new NotFoundException('SESSION_NOT_FOUND');
    if (s.status === SessionStatus.COMPLETED) return s;
    return this.prisma.planSession.update({
      where: { id: sessionId },
      data: { status: SessionStatus.COMPLETED, completedAt: new Date() },
    });
  }

  async logSet(sessionId: number, planSetId: number, actualReps: number, actualWeight?: number, rpe?: number, note?: string): Promise<PlanSetLog> {
    const [session, planSet] = await Promise.all([
      this.prisma.planSession.findUnique({ where: { id: sessionId } }),
      this.prisma.planSet.findUnique({ where: { id: planSetId } }),
    ]);
    if (!session) throw new NotFoundException('SESSION_NOT_FOUND');
    if (!planSet) throw new NotFoundException('SET_NOT_FOUND');
    return this.prisma.planSetLog.create({ data: { sessionId, planSetId, actualReps, actualWeight, rpe, note } });
  }

  addSessionNote(sessionId: number, role: string, text?: string, audioUrl?: string, authorId?: number): Promise<PlanSessionNote> {
    return this.prisma.planSessionNote.create({ data: { sessionId, role, text, audioUrl, authorId } });
  }

  sessionsByClient(clientId: number, from: Date, to: Date): Promise<PlanSession[]> {
    return this.prisma.planSession.findMany({
      where: { clientId, date: { gte: from, lte: to } },
      orderBy: { date: 'asc' },
    });
  }

  /** Completion rate over a window (fixed: sessions now carry clientId). */
  async userAdherence(clientId: number, from: Date, to: Date): Promise<{ clientId: number; scheduled: number; completed: number; completionRate: number }> {
    const window = { clientId, date: { gte: from, lte: to } };
    const scheduled = await this.prisma.planSession.count({ where: window });
    const completed = await this.prisma.planSession.count({ where: { ...window, status: SessionStatus.COMPLETED } });
    return { clientId, scheduled, completed, completionRate: Number((scheduled ? completed / scheduled : 0).toFixed(3)) };
  }
}
