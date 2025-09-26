
import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, TileState } from '@prisma/client';

export type UpsertTileInput = {
  id?: string;
  page: string;
  order?: number;
  type: string;
  variant?: string;
  weight?: number;
  logicalId?: string;
  state?: 'DRAFT'|'PUBLISHED'|'ARCHIVED';
  data: any;
  actorId: string;
};

@Injectable()
export class TilesPrismaService {
  private prisma = new PrismaClient();
  private log = new Logger(TilesPrismaService.name);

  async list(page?: string, includeDraft?: boolean){
    if (page) {
      return this.prisma.tile.findMany({ where: { page, state: includeDraft ? { in: ['DRAFT','PUBLISHED'] } : { in: ['PUBLISHED'] } }, orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }] });
    }
    return this.prisma.tile.findMany({ where: { state: includeDraft ? { in: ['DRAFT','PUBLISHED'] } : { in: ['PUBLISHED'] } }, orderBy: [{ page: 'asc' }, { order: 'asc' }] });
  }

  async publish(tileId: string, actorId: string){
    const t = await this.prisma.tile.update({ where: { id: tileId }, data: { state: 'PUBLISHED', updatedBy: actorId, version: { increment: 1 } } });
    await this.prisma.tileVersion.create({ data: { tileId, version: t.version, data: t.data as any, state: 'PUBLISHED', authorId: actorId } });
    await this.prisma.publishAudit.create({ data: { tileId: t.id, action: 'UPSERT', actorId, fromState: undefined as any, toState: t.state as any, snapshot: t.data as any } });
      await this.prisma.publishAudit.create({ data: { tileId: t.id, action: 'UPSERT', actorId, toState: t.state as any, snapshot: t.data as any } });
      return t;
  }

  async upsert(input: UpsertTileInput){
    const { id, page, order=0, type, state='DRAFT', data, actorId, variant, weight, logicalId } = input;
    if (id){
      const t = await this.prisma.tile.update({ where: { id }, data: { page, order, type, state, data, updatedBy: actorId, variant, weight, logicalId } });
      await this.prisma.tileVersion.create({ data: { tileId: id, version: t.version, data: t.data as any, state, authorId: actorId } });
      await this.prisma.publishAudit.create({ data: { tileId: t.id, action: 'UPSERT', actorId, fromState: undefined as any, toState: t.state as any, snapshot: t.data as any } });
      return t;
    }
    const t = await this.prisma.tile.create({ data: { page, order, type, state, data, createdBy: actorId, updatedBy: actorId, variant, weight, logicalId } });
    await this.prisma.tileVersion.create({ data: { tileId: t.id, version: t.version, data: t.data as any, state, authorId: actorId } });
    await this.prisma.publishAudit.create({ data: { tileId: t.id, action: 'UPSERT', actorId, fromState: undefined as any, toState: t.state as any, snapshot: t.data as any } });
      await this.prisma.publishAudit.create({ data: { tileId: t.id, action: 'UPSERT', actorId, toState: t.state as any, snapshot: t.data as any } });
      return t;
  }

  async history(tileId: string){
    return this.prisma.tileVersion.findMany({ where: { tileId }, orderBy: { createdAt: 'desc' } });
  }
}
