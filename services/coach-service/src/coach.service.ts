import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

@Injectable()
export class CoachService {
  prisma = new PrismaClient();

  // Program Templates
  async createTemplate(coachId: string, name: string, content: any){
    const t = await this.prisma.programTemplate.create({ data: { id: uid(), coachId, name, status: 'draft', currentVersionNumber: 0 } });
    await this.prisma.programTemplateVersion.create({ data: { id: uid(), templateId: t.id, versionNumber: 0, content } });
    return { id: t.id, name: t.name, status: t.status, version: 0 };
  }

  async updateDraft(coachId: string, templateId: string, name: string|undefined, content: any|undefined){
    const t = await this.prisma.programTemplate.findUnique({ where: { id: templateId } });
    if (!t || t.coachId !== coachId) throw new ForbiddenException('NOT_OWNER');
    if (t.status !== 'draft') throw new BadRequestException('LOCKED_PUBLISHED');
    if (name) await this.prisma.programTemplate.update({ where: { id: t.id }, data: { name } });
    if (content!==undefined){
      await this.prisma.programTemplateVersion.update({ where: { templateId_versionNumber: { templateId: t.id, versionNumber: 0 } }, data: { content } });
    }
    return { ok: true };
  }

  async publish(coachId: string, templateId: string){
    const t = await this.prisma.programTemplate.findUnique({ where: { id: templateId } });
    if (!t || t.coachId !== coachId) throw new ForbiddenException('NOT_OWNER');
    if (t.status === 'published') throw new BadRequestException('ALREADY_PUBLISHED'); // immutability of published
    const draft = await this.prisma.programTemplateVersion.findUnique({ where: { templateId_versionNumber: { templateId: t.id, versionNumber: 0 } } });
    const nextVer = t.currentVersionNumber + 1;
    await this.prisma.programTemplateVersion.create({ data: { id: uid(), templateId: t.id, versionNumber: nextVer, content: draft!.content, publishedAt: new Date() } });
    await this.prisma.programTemplate.update({ where: { id: t.id }, data: { status: 'published', currentVersionNumber: nextVer } });
    return { id: t.id, version: nextVer };
  }

  async assignTemplate(coachId: string, templateId: string, userIds: string[]){
    const t = await this.prisma.programTemplate.findUnique({ where: { id: templateId } });
    if (!t || t.coachId !== coachId) throw new ForbiddenException('NOT_OWNER');
    if (t.status !== 'published') throw new BadRequestException('NOT_PUBLISHED');
    const ver = t.currentVersionNumber;
    const out:any[] = [];
    for (const u of userIds){
      try {
        const a = await this.prisma.programAssignment.create({ data: { id: uid(), templateId: t.id, versionNumber: ver, coachId, userId: u } });
        out.push({ userId: u, status: 'assigned', assignmentId: a.id });
      } catch {
        out.push({ userId: u, status: 'duplicate' });
      }
    }
    return { results: out };
  }

  // Called by workouts-service in future; here public for demo
  async recordProgress(userId: string, templateId: string){
    const t = await this.prisma.programTemplate.findUnique({ where: { id: templateId } });
    if (!t) throw new BadRequestException('TEMPLATE_NOT_FOUND');
    const a = await this.prisma.programAssignment.findFirst({ where: { templateId, userId } });
    if (!a) throw new BadRequestException('ASSIGNMENT_NOT_FOUND');
    await this.prisma.programAssignment.update({ where: { id: a.id }, data: { completedSessions: { increment: 1 }, lastSessionAt: new Date() } });
    return { ok: true };
  }

  // Roster: adherence% (3 sessions/week plan), lastSession, flags
  async roster(coachId: string){
    const assigns = await this.prisma.programAssignment.findMany({ where: { coachId }, include: { template: true } });
    const out = assigns.map(a=>{
      const days = Math.max(1, Math.ceil((Date.now() - a.assignedAt.getTime())/ (24*3600*1000)));
      const expected = Math.max(1, Math.ceil(days/7) * 3);
      const adherence = Math.min(100, Math.round((a.completedSessions/expected)*100));
      const last = a.lastSessionAt?.toISOString() || null;
      const flags:string[] = [];
      if (adherence < 50) flags.push('low-adherence');
      if (a.lastSessionAt && (Date.now() - a.lastSessionAt.getTime()) > 7*24*3600*1000) flags.push('inactive-7d');
      return { userId: a.userId, templateId: a.templateId, version: a.versionNumber, adherence, lastSessionAt: last, flags };
    });
    return { items: out };
  }

  // Payouts
  async requestPayout(coachId: string, amountCents: number, notes?: string){
    if (amountCents <= 0) throw new BadRequestException('INVALID_AMOUNT');
    const p = await this.prisma.payoutRequest.create({ data: { id: uid(), coachId, amountCents, notes: notes||null } });
    return { id: p.id, status: p.status };
  }
  async myPayouts(coachId: string){
    const rows = await this.prisma.payoutRequest.findMany({ where: { coachId }, orderBy: { createdAt: 'desc' } });
    return { items: rows };
  }
  // Admin
  async approvePayout(id: string){
    const p = await this.prisma.payoutRequest.update({ where: { id }, data: { status: 'approved', approvedAt: new Date() } });
    await this.prisma.domainEventOutbox.create({ data: { id: uid(), type:'PAYOUT_APPROVED', data: { payoutId: p.id, coachId: p.coachId, amountCents: p.amountCents } as any } });
    return { ok: true };
  }
  async markPaid(id: string){
    await this.prisma.payoutRequest.update({ where: { id }, data: { status: 'paid', paidAt: new Date() } });
    return { ok: true };
  }
}
