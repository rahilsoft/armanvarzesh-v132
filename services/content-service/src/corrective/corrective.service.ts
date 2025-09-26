
import { Injectable } from '@nestjs/common';
import { PrismaClient, CorrectiveStatus } from '@prisma/client';
import { CreateConditionInput } from './dto/create-condition.input';
import { CreateCorrectiveVideoInput } from './dto/create-corrective-video.input';
import { SearchCorrectiveInput } from './dto/search-corrective.input';

type Condition = { code:string, nameFa:string, nameEn?:string, description?:string };
type Video = { id:string, title:string, url:string, conditions:string[], equipment?:string, notes?:string, uploadedBy:string, status:'PENDING'|'APPROVED'|'REJECTED', createdAt:Date };

@Injectable()
export class CorrectiveService {
  private prisma = new PrismaClient();
  private conditions: Condition[] = [
    { code:'kyphosis', nameFa:'کایفوز (قوز پشتی)' },
    { code:'lordosis', nameFa:'لوردوز (گودی کمر)' },
    { code:'forward_head', nameFa:'سر به جلو' },
    { code:'genu_varum', nameFa:'زانوی پرانتزی' },
    { code:'genu_valgum', nameFa:'زانوی ضربدری' },
    { code:'pes_planus', nameFa:'صافی کف پا' },
  ];
  private videos: Video[] = [];
  private idSeq = 1;

  async listConditions(){ return this.prisma.condition.findMany({ orderBy:{ code:'asc' } }); }

  async upsertCondition(input: any){ return this.prisma.condition.upsert({ where:{ code: input.code }, update:{ nameFa: input.nameFa, nameEn: input.nameEn, description: input.description }, create:{ code: input.code, nameFa: input.nameFa, nameEn: input.nameEn, description: input.description } }); }
  async deleteCondition(code:string){ await this.prisma.correctiveVideoCondition.deleteMany({ where:{ conditionCode: code } }); await this.prisma.condition.delete({ where:{ code } }); return true; }

  async uploadVideo(input: any){ const v = await this.prisma.correctiveVideo.create({ data:{ title: input.title, url: input.url, equipment: input.equipment||null, notes: input.notes||null, voiceUrl: input.voiceUrl||null, uploadedBy: input.uploadedBy, status: 'PENDING' as CorrectiveStatus, visibility: 'PRIVATE' as Visibility } }); if (Array.isArray(input.conditions)&&input.conditions.length){ await this.prisma.correctiveVideoCondition.createMany({ data: input.conditions.map((c:string)=> ({ videoId: v.id, conditionCode: c })) }); } return v as any; }

  async updateVideo(id:string, patch:any, ctx?:{role?:string, userId?:string}){ const v = await this.prisma.correctiveVideo.update({ where:{ id }, data:{ title: patch.title||undefined, url: patch.url||undefined, voiceUrl: patch.voiceUrl===undefined? undefined: patch.voiceUrl, equipment: patch.equipment===undefined? undefined: patch.equipment, notes: patch.notes===undefined? undefined: patch.notes, status: (ctx && ctx.role!=='admin') ? 'PENDING' : undefined } }); if (patch.conditions){ await this.prisma.correctiveVideoCondition.deleteMany({ where:{ videoId: id } }); await this.prisma.correctiveVideoCondition.createMany({ data: (patch.conditions||[]).map((c:string)=> ({ videoId: id, conditionCode: c })) }); } return v as any; }

  async approveVideo(id:string, status:'APPROVED'|'REJECTED'='APPROVED', opts?:{note?:string, visibility?:'PUBLIC'|'PRIVATE', actorId?:string}){ await this.prisma.$transaction(async(tx)=>{ await tx.correctiveVideo.update({ where:{ id }, data:{ status, reviewNote: opts?.note||null, reviewedBy: opts?.actorId||null, reviewedAt: new Date(), visibility: (opts?.visibility as any)||undefined } }); await tx.moderationLog.create({ data:{ entity:'CorrectiveVideo', entityId:id, action: status==='APPROVED'?'APPROVE':'REJECT', note: opts?.note||null, actorId: opts?.actorId||null } }); }); return true; }, data:{ status } }); return true; }

  async listVideos(input?: any, ctx?:{role?:string, userId?:string}){ const where:any = {}; if (input?.q){ where.OR = [{ title:{ contains: input.q, mode:'insensitive' } }, { notes:{ contains: input.q, mode:'insensitive' } }]; } if (input?.approvedOnly){ where.status = 'APPROVED'; }
  if (input?.mineOnly && ctx?.userId){ where.uploadedBy = ctx.userId; }
  if (input?.visibility){ where.visibility = input.visibility; }
  if (!input?.approvedOnly){ if (ctx?.role!=='admin'){ /* non-admin cannot see other PENDING/REJECTED */ where.OR = [ { uploadedBy: ctx?.userId||'__' }, { status: 'APPROVED' } ]; } }
  const vids = await this.prisma.correctiveVideo.findMany({ where, orderBy:{ createdAt:'desc' }, include:{ conditions: true } });
  let arr = vids.map(v=> ({...v, conditions: v.conditions.map(c=> c.conditionCode)}));
  if (input?.conditions?.length){ arr = arr.filter(v=> v.conditions.some((c:string)=> input.conditions.includes(c))); }
  if (input?.equipment){ arr = arr.filter(v=> (v.equipment||'').toLowerCase().includes(String(input.equipment).toLowerCase())); }
  return arr as any; }
}
