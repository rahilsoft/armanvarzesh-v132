import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { uid } from './types';

const ISO = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0,10);

@Injectable()
export class PhysioService {
  private prisma = new PrismaClient();

  async assignProtocol(userId: string, protocolId: string) {
    // archive previous
    await this.prisma.physioAssignment.updateMany({ where: { userId, archivedAt: null }, data: { archivedAt: new Date() } });
    const assignmentId = uid();
    await this.prisma.physioAssignment.create({ data: { id: assignmentId, userId, protocolId, startedAt: new Date() } });
    await this.prisma.physioSession.create({ data: { id: uid(), assignmentId, date: today(), completed: false } });
    return { id: assignmentId, userId, protocolId };
  }

  async myPlan(userId: string) {
    const assignment = await this.prisma.physioAssignment.findFirst({ where: { userId, archivedAt: null }, orderBy: { startedAt: 'desc' } });
    if (!assignment) return null;
    const protocol = await this.prisma.physioProtocol.findUnique({ where: { id: assignment.protocolId }, include: { steps: true } });
    const session = await this.prisma.physioSession.findFirst({ where: { assignmentId: assignment.id, date: today() } });
    const steps = (protocol?.steps||[]).filter(s => s.day === new Date().getDay());
    return { assignment, protocol, today: { session, steps } };
  }

  async completeSession(sessionId: string, currentUserId: string) {
    const session = await this.prisma.physioSession.findUnique({ where: { id: sessionId } });
      if (!session) throw new BadRequestException('SESSION_NOT_FOUND');
      const a = await this.prisma.physioAssignment.findUnique({ where: { id: session.assignmentId } });
      if (!a || a.userId !== currentUserId) throw new BadRequestException('FORBIDDEN');
    if (!session) throw new BadRequestException('SESSION_NOT_FOUND');
    if (session.completed) return session;
    return this.prisma.physioSession.update({ where: { id: sessionId }, data: { completed: true, completedAt: new Date() } });
  }

  async logPain(sessionId: string, score: number, notes: string|undefined, currentUserId: string) {
    if (score<0 || score>10) throw new BadRequestException('VAS_RANGE');
    const session = await this.prisma.physioSession.findUnique({ where: { id: sessionId } });
      if (!session) throw new BadRequestException('SESSION_NOT_FOUND');
      const a = await this.prisma.physioAssignment.findUnique({ where: { id: session.assignmentId } });
      if (!a || a.userId !== currentUserId) throw new BadRequestException('FORBIDDEN');
      const last = await this.prisma.painLog.findFirst({ where: { sessionId }, orderBy: { createdAt: 'desc' } });
    if (last && (Date.now() - new Date(last.createdAt).getTime() < 2*60*60*1000)) throw new BadRequestException('VAS_TOO_FREQUENT');
    return this.prisma.painLog.create({ data: { id: uid(), sessionId, score, notes } });
  }

  async recordRom(userId: string, joint: string, side: 'left'|'right'|'bilateral', angle: number) {
    if (!joint) throw new BadRequestException('JOINT_REQUIRED');
    if (angle<0 || angle>360) throw new BadRequestException('ANGLE_RANGE');
    return this.prisma.romMeasure.create({ data: { id: uid(), userId, joint, side, angle } });
  }

  async progress(userId: string, range?: { from?: string, to?: string }) {
    const from = range?.from ? new Date(range.from) : new Date(0);
    const to = range?.to ? new Date(range.to) : new Date();
    const rom = await this.prisma.romMeasure.findMany({ where: { userId, createdAt: { gte: from, lte: to } }, orderBy: { createdAt: 'asc' } });
    // sessions for user
    const assignments = await this.prisma.physioAssignment.findMany({ where: { userId } });
    const assignmentIds = assignments.map(a=>a.id);
    const sessionIds = (await this.prisma.physioSession.findMany({ where: { assignmentId: { in: assignmentIds } }, select: { id: true } })).map(s=>s.id);
    const vas = await this.prisma.painLog.findMany({ where: { sessionId: { in: sessionIds } }, orderBy: { createdAt: 'asc' } });
    return { rom, vas };
  }

  async seedProtocols(protocols: any[]) {
    for (const p of protocols) {
      await this.prisma.physioProtocol.upsert({
        where: { id: p.id },
        create: { id: p.id, name: p.name, area: p.area, weeks: p.weeks,
          steps: { create: (p.steps||[]).map((s:any)=>({ id:s.id, week:s.week, day:s.day, exerciseId:s.exerciseId, notes:s.notes, seconds:s.seconds, videoUrl:s.videoUrl })) } },
        update: { name: p.name, area: p.area, weeks: p.weeks }
      });
    }
    return { ok: true };
  }
}
