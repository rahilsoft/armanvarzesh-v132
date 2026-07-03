import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Tile, TileState, IntakeForm, IntakeResponse, FeatureFlag, Lead, SurveyResponse, Prisma } from '@prisma/client';

/**
 * CMS group — page tiles with version history + publish audit trail, intake
 * forms, feature flags, CRM leads/conversions and survey responses. Folded
 * from services/content-service (dismemberment step 5; cuid -> Int PKs;
 * injected PrismaService). Every tile mutation snapshots a TileVersion and
 * writes a PublishAudit row — behaviour of the original tiles workflow.
 */

export interface UpsertTileInput {
  id?: number;
  page: string;
  order?: number;
  type: string;
  variant?: string;
  weight?: number;
  logicalId?: string;
  data: Prisma.InputJsonValue;
  actorId?: number;
}

@Injectable()
export class CmsTilesService {
  constructor(private readonly prisma: PrismaService) {}

  /*** Tiles (draft → publish workflow) ***/

  async upsertTile(input: UpsertTileInput): Promise<Tile> {
    const { id, actorId, ...data } = input;
    let tile: Tile;
    if (id) {
      const existing = await this.prisma.tile.findUnique({ where: { id } });
      if (!existing) throw new NotFoundException('TILE_NOT_FOUND');
      tile = await this.prisma.tile.update({
        where: { id },
        data: { ...data, updatedBy: actorId, version: { increment: 1 } },
      });
    } else {
      tile = await this.prisma.tile.create({ data: { ...data, createdBy: actorId, updatedBy: actorId } });
    }
    await this.prisma.tileVersion.create({
      data: { tileId: tile.id, version: tile.version, data: tile.data as Prisma.InputJsonValue, state: tile.state, authorId: actorId },
    });
    await this.prisma.publishAudit.create({
      data: { tileId: tile.id, action: 'UPSERT', actorId, toState: tile.state, snapshot: tile.data as Prisma.InputJsonValue },
    });
    return tile;
  }

  async publishTile(id: number, actorId?: number): Promise<Tile> {
    const existing = await this.prisma.tile.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('TILE_NOT_FOUND');
    const tile = await this.prisma.tile.update({ where: { id }, data: { state: TileState.PUBLISHED } });
    await this.prisma.publishAudit.create({
      data: { tileId: id, action: 'PUBLISH', actorId, fromState: existing.state, toState: TileState.PUBLISHED },
    });
    return tile;
  }

  /** Public page render: published tiles in order. */
  pageTiles(page: string): Promise<Tile[]> {
    return this.prisma.tile.findMany({
      where: { page, state: TileState.PUBLISHED },
      orderBy: { order: 'asc' },
    });
  }

  tileHistory(tileId: number) {
    return this.prisma.tileVersion.findMany({ where: { tileId }, orderBy: { version: 'desc' } });
  }

  /*** Intake forms ***/

  async createIntakeForm(slug: string, title: string, questions: { key: string; label: string; type: string; required?: boolean; order?: number; options?: Prisma.InputJsonValue; validation?: Prisma.InputJsonValue; section?: string }[]): Promise<IntakeForm> {
    return this.prisma.intakeForm.create({
      data: {
        slug, title,
        questions: { create: questions.map((q, i) => ({ ...q, order: q.order ?? i })) },
      },
      include: { questions: true },
    });
  }

  async activateIntakeForm(slug: string): Promise<IntakeForm> {
    const form = await this.prisma.intakeForm.findUnique({ where: { slug } });
    if (!form) throw new NotFoundException('FORM_NOT_FOUND');
    return this.prisma.intakeForm.update({
      where: { slug },
      data: { active: true, publishedAt: new Date(), version: { increment: 1 } },
    });
  }

  async submitIntake(userId: number, slug: string, answers: Prisma.InputJsonValue): Promise<IntakeResponse> {
    const form = await this.prisma.intakeForm.findUnique({ where: { slug } });
    if (!form || !form.active) throw new NotFoundException('FORM_NOT_ACTIVE');
    return this.prisma.intakeResponse.create({
      data: { userId, formId: form.id, formVersion: form.version, answers },
    });
  }

  /*** Feature flags ***/

  async setFlag(key: string, value: boolean, updatedBy?: number, description?: string): Promise<FeatureFlag> {
    return this.prisma.featureFlag.upsert({
      where: { key },
      update: { value, updatedBy, ...(description !== undefined ? { description } : {}) },
      create: { key, value, updatedBy, description },
    });
  }

  async isEnabled(key: string): Promise<boolean> {
    const f = await this.prisma.featureFlag.findUnique({ where: { key } });
    return f?.value ?? false;
  }

  /*** CRM: leads / conversions / survey responses ***/

  createLead(userId: number, specialistId: number, serviceType: Lead['serviceType']): Promise<Lead> {
    return this.prisma.lead.create({ data: { userId, specialistId, serviceType } });
  }

  async recordConversion(userId: number, specialistId: number, serviceType: Lead['serviceType'], kind: 'FREE_TO_PREMIUM' | 'RENEWAL'): Promise<void> {
    await this.prisma.conversionEvent.create({ data: { userId, specialistId, serviceType, kind } });
    if (kind === 'FREE_TO_PREMIUM') {
      await this.prisma.lead.updateMany({
        where: { userId, specialistId, serviceType, status: 'OPEN' },
        data: { status: 'CONVERTED' },
      });
    }
  }

  submitSurveyResponse(templateCode: string, userId: number, specialistId: number, rating: number, comment?: string): Promise<SurveyResponse> {
    return this.prisma.surveyResponse.create({ data: { templateCode, userId, specialistId, rating, comment } });
  }
}
