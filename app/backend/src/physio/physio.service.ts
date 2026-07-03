import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PhysioAssignment, PhysioSession, PainLog, RomMeasure, Prisma } from '@prisma/client';

/**
 * Rehab protocols, assignments, daily sessions, pain (VAS) and range-of-motion
 * tracking — folded from services/physio-service (String ids -> core Int PKs;
 * injected PrismaService replaces its private `new PrismaClient()`; the
 * duplicated owner-check/null-check blocks are collapsed into one guard).
 */

const todayKey = () => new Date().toISOString().slice(0, 10);

export interface SeedProtocolInput {
  name: string;
  area: string;
  weeks: number;
  steps?: { week: number; day: number; exerciseId?: number; notes?: string; seconds?: number; videoUrl?: string }[];
}

@Injectable()
export class PhysioService {
  constructor(private readonly prisma: PrismaService) {}

  /** Assign a protocol; archives any active assignment and opens today's session. */
  async assignProtocol(userId: number, protocolId: number): Promise<PhysioAssignment> {
    const protocol = await this.prisma.physioProtocol.findUnique({ where: { id: protocolId } });
    if (!protocol) throw new BadRequestException('PROTOCOL_NOT_FOUND');
    await this.prisma.physioAssignment.updateMany({
      where: { userId, archivedAt: null },
      data: { archivedAt: new Date() },
    });
    const assignment = await this.prisma.physioAssignment.create({
      data: { userId, protocolId, startedAt: new Date() },
    });
    await this.prisma.physioSession.create({
      data: { assignmentId: assignment.id, date: todayKey(), completed: false },
    });
    return assignment;
  }

  async myPlan(userId: number) {
    const assignment = await this.prisma.physioAssignment.findFirst({
      where: { userId, archivedAt: null },
      orderBy: { startedAt: 'desc' },
    });
    if (!assignment) return null;
    const protocol = await this.prisma.physioProtocol.findUnique({
      where: { id: assignment.protocolId },
      include: { steps: true },
    });
    const session = await this.prisma.physioSession.findFirst({
      where: { assignmentId: assignment.id, date: todayKey() },
    });
    const steps = (protocol?.steps ?? []).filter((s) => s.day === new Date().getDay());
    return { assignment, protocol, today: { session, steps } };
  }

  /** Load a session and verify it belongs to `userId` (single guard for the
   *  duplicated check blocks in the original). */
  private async ownedSession(sessionId: number, userId: number): Promise<PhysioSession> {
    const session = await this.prisma.physioSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new BadRequestException('SESSION_NOT_FOUND');
    const assignment = await this.prisma.physioAssignment.findUnique({ where: { id: session.assignmentId } });
    if (!assignment || assignment.userId !== userId) throw new BadRequestException('FORBIDDEN');
    return session;
  }

  async completeSession(sessionId: number, currentUserId: number): Promise<PhysioSession> {
    const session = await this.ownedSession(sessionId, currentUserId);
    if (session.completed) return session;
    return this.prisma.physioSession.update({
      where: { id: sessionId },
      data: { completed: true, completedAt: new Date() },
    });
  }

  /** VAS pain log: 0–10, rate-limited to one entry per 2h per session. */
  async logPain(sessionId: number, score: number, notes: string | undefined, currentUserId: number): Promise<PainLog> {
    if (score < 0 || score > 10) throw new BadRequestException('VAS_RANGE');
    await this.ownedSession(sessionId, currentUserId);
    const last = await this.prisma.painLog.findFirst({ where: { sessionId }, orderBy: { createdAt: 'desc' } });
    if (last && Date.now() - last.createdAt.getTime() < 2 * 60 * 60 * 1000) {
      throw new BadRequestException('VAS_TOO_FREQUENT');
    }
    return this.prisma.painLog.create({ data: { sessionId, score, notes } });
  }

  async recordRom(userId: number, joint: string, side: 'left' | 'right' | 'bilateral', angle: number): Promise<RomMeasure> {
    if (!joint) throw new BadRequestException('JOINT_REQUIRED');
    if (angle < 0 || angle > 360) throw new BadRequestException('ANGLE_RANGE');
    return this.prisma.romMeasure.create({ data: { userId, joint, side, angle } });
  }

  async progress(userId: number, range?: { from?: string; to?: string }): Promise<{ rom: RomMeasure[]; vas: PainLog[] }> {
    const from = range?.from ? new Date(range.from) : new Date(0);
    const to = range?.to ? new Date(range.to) : new Date();
    const rom = await this.prisma.romMeasure.findMany({
      where: { userId, createdAt: { gte: from, lte: to } },
      orderBy: { createdAt: 'asc' },
    });
    // Pain logs across all of the user's sessions, one relation-filtered query
    // (the original collected ids through two intermediate queries).
    const vas = await this.prisma.painLog.findMany({
      where: { session: { assignment: { userId } } },
      orderBy: { createdAt: 'asc' },
    });
    return { rom, vas };
  }

  async seedProtocols(protocols: SeedProtocolInput[]): Promise<{ ok: true; count: number }> {
    for (const p of protocols) {
      await this.prisma.physioProtocol.create({
        data: {
          name: p.name,
          area: p.area,
          weeks: p.weeks,
          steps: {
            create: (p.steps ?? []).map((s) => ({
              week: s.week, day: s.day, exerciseId: s.exerciseId,
              notes: s.notes, seconds: s.seconds, videoUrl: s.videoUrl,
            })) as Prisma.PhysioStepCreateWithoutProtocolInput[],
          },
        },
      });
    }
    return { ok: true, count: protocols.length };
  }
}
