import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Condition, CorrectiveVideo, CorrectiveProgress, CorrectiveStatus, Visibility } from '@prisma/client';

/**
 * Corrective-exercise content — condition taxonomy, moderated corrective
 * videos and per-assignment daily corrective checks. Folded from
 * services/content-service (dismemberment step 6; cuid -> Int PKs).
 * CorrectiveProgress hangs off the canonical PhysioAssignment, closing the
 * loop with the Physio fold. Moderation writes a ModerationLog row (the
 * step-5 CMS model) so review actions are auditable.
 */

@Injectable()
export class CorrectiveService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Condition taxonomy ***/

  upsertCondition(code: string, nameFa: string, nameEn?: string, description?: string): Promise<Condition> {
    return this.prisma.condition.upsert({
      where: { code },
      update: { nameFa, nameEn, description },
      create: { code, nameFa, nameEn, description },
    });
  }

  listConditions(): Promise<Condition[]> {
    return this.prisma.condition.findMany({ orderBy: { code: 'asc' } });
  }

  /*** Corrective videos (moderated) ***/

  async uploadVideo(uploadedBy: number, title: string, url: string, conditionCodes: string[], extras?: { equipment?: string; notes?: string; voiceUrl?: string }): Promise<CorrectiveVideo> {
    const conditions = await this.prisma.condition.findMany({ where: { code: { in: conditionCodes } } });
    if (conditions.length !== conditionCodes.length) throw new BadRequestException('UNKNOWN_CONDITION');
    return this.prisma.correctiveVideo.create({
      data: {
        title, url, uploadedBy, ...extras,
        conditions: { create: conditionCodes.map((conditionCode) => ({ conditionCode })) },
      },
      include: { conditions: true },
    });
  }

  /** Review: sets status + audit fields, writes a ModerationLog row, and
   *  approved-public videos become visible to browse(). */
  async reviewVideo(id: number, reviewedBy: number, status: CorrectiveStatus, reviewNote?: string, visibility?: Visibility): Promise<CorrectiveVideo> {
    const existing = await this.prisma.correctiveVideo.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('VIDEO_NOT_FOUND');
    const video = await this.prisma.correctiveVideo.update({
      where: { id },
      data: {
        status, reviewNote, reviewedBy, reviewedAt: new Date(),
        ...(visibility ? { visibility } : {}),
      },
    });
    await this.prisma.moderationLog.create({
      data: { entity: 'CorrectiveVideo', entityId: id, action: status === CorrectiveStatus.APPROVED ? 'APPROVE' : 'REJECT', note: reviewNote, actorId: reviewedBy },
    });
    return video;
  }

  /** Public browse: approved + public, optionally filtered by condition. */
  browse(conditionCode?: string): Promise<CorrectiveVideo[]> {
    return this.prisma.correctiveVideo.findMany({
      where: {
        status: CorrectiveStatus.APPROVED,
        visibility: Visibility.PUBLIC,
        ...(conditionCode ? { conditions: { some: { conditionCode } } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /*** Per-assignment corrective checks ***/

  /** Idempotent daily check (unique per assignment+day+item). */
  async logCheck(assignmentId: number, dayIndex: number, itemKey: string, value: string): Promise<CorrectiveProgress> {
    const assignment = await this.prisma.physioAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new NotFoundException('ASSIGNMENT_NOT_FOUND');
    return this.prisma.correctiveProgress.upsert({
      where: { assignmentId_dayIndex_itemKey: { assignmentId, dayIndex, itemKey } },
      update: { value },
      create: { assignmentId, dayIndex, itemKey, value },
    });
  }

  checks(assignmentId: number): Promise<CorrectiveProgress[]> {
    return this.prisma.correctiveProgress.findMany({ where: { assignmentId }, orderBy: [{ dayIndex: 'asc' }, { itemKey: 'asc' }] });
  }
}
