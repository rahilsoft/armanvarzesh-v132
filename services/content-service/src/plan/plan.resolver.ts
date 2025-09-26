
import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaClient, BlockType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { enqueueMediaProcessing } from '../jobs/media.worker';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const prisma = new PrismaClient();
import { PlanKind } from '@prisma/client';
const jwt = require('jsonwebtoken');

const __searchCache: Map<string, { t:number, v:any[] }> = new Map();
function cacheKey(obj:any){ try{ return JSON.stringify(obj); }catch(e){ return String(obj); } }


@InputType()
class ComplexBlockInput {
  @Field() dayId!: string;
  @Field() section!: string; // WARMUP|MAIN|COOLDOWN
  @Field() type!: string;    // SINGLE|SUPERSET|TRISET|CIRCUIT
  @Field(() => [String]) exerciseIds!: string[];
  @Field({nullable:true}) rounds?: number;
  @Field({nullable:true}) restBetweenItemsSec?: number;
  @Field({nullable:true}) protocol?: string; // 5x5|GVT|EMOM|HIIT
  @Field({nullable:true}) params?: string;   // JSON
}


@ObjectType() class AdherenceDTO { @Field() clientId:string; @Field() scheduled:number; @Field() completed:number; @Field() completionRate:number; }
@ObjectType() class ExerciseStatDTO { @Field() id:string; @Field() title:string; @Field() viewCount:number; @Field() likeCount:number; }
@ObjectType() class LoadPointDTO { @Field() week:string; @Field() load:number; }


@ObjectType() class PlanSessionNoteDTO {
  @Field() id:string;
  @Field() sessionId:string;
  @Field({nullable:true}) authorId?:string;
  @Field() role:string;
  @Field({nullable:true}) text?:string;
  @Field({nullable:true}) audioUrl?:string;
  @Field() createdAt:Date;
}
@InputType() class UpsertSessionNoteInput {
  @Field() sessionId:string;
  @Field({nullable:true}) text?:string;
  @Field({nullable:true}) audioUrl?:string;
  @Field({nullable:true}) role?:string;
  @Field({nullable:true}) authorId?:string;
}


@ObjectType() class ValidationIssueDTO { @Field() level:string; @Field() message:string; @Field({nullable:true}) blockId?:string; }
@ObjectType() class BlockSimDTO { @Field() blockId:string; @Field() seconds:number; @Field({nullable:true}) rounds?:number; }
@ObjectType() class SessionSimDTO { @Field() sessionId:string; @Field() totalSeconds:number; @Field(() => [BlockSimDTO]) blocks: BlockSimDTO[]; }


function ctxRole(ctx:any){ try{ const h = ctx?.req?.headers||{}; const b = (h['authorization']||'').toString(); if (b.startsWith('Bearer ')){ try{ const t = b.slice(7); const d:any = jwt.verify(t, process.env.JWT_SECRET||'dev'); return d?.role||'guest'; }catch(e){} } return h['x-role']||ctx?.role||'guest'; }catch(e){ return 'guest'; } }
function ctxUser(ctx:any){ try{ const h = ctx?.req?.headers||{}; const b = (h['authorization']||'').toString(); if (b.startsWith('Bearer ')){ try{ const t = b.slice(7); const d:any = jwt.verify(t, process.env.JWT_SECRET||'dev'); return d?.sub||d?.userId||null; }catch(e){} } return h['x-user-id']||ctx?.userId||null; }catch(e){ return null; } }
function mustRole(ctx:any, role:'admin'|'coach'|'user'|'specialist'){ if (process.env.SKIP_AUTH==='1') return; const r = ctxRole(ctx); if (r!==role && r!=='admin') throw new Error('forbidden'); }


@ObjectType() class PlanSetLogDTO {
  @Field() id:string;
  @Field() sessionId:string;
  @Field() planSetId:string;
  @Field() actualReps:number;
  @Field({nullable:true}) actualWeight?:number;
  @Field({nullable:true}) rpe?:number;
  @Field({nullable:true}) note?:string;
  @Field() createdAt:Date;
}

import { buildPlanFromTemplate } from './templates';
const s3 = (process.env.S3_BUCKET && process.env.AWS_REGION) ? new S3Client({ region: process.env.AWS_REGION }) : null as any;
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

@ObjectType()
class PageInfo { @Field() endCursor: string; @Field() hasNextPage: boolean; }
@ObjectType()
class Edge { @Field() id: string; }

@ObjectType()
class ExerciseDTO {
  @Field() id: string;
  @Field() title: string;
  @Field() videoUrl: string;
  @Field({ nullable: true }) audioUrl?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) level?: string;
  @Field({ nullable: true }) kind?: string;
  @Field({ nullable: true }) ownerId?: string;
  @Field() status: string;
  @Field({ nullable: true }) media?: string; // alias for videoUrl
  @Field({ nullable: true }) muscleGroup?: string; // first primary muscle code
  @Field({ nullable: true }) equipment?: string; // first equipment
}

@ObjectType()
class ExercisesPage {
  @Field(() => [ExerciseDTO]) edges: ExerciseDTO[];
  @Field(() => PageInfo) pageInfo: PageInfo;
  @Field() total: number;
}

@InputType()
class ExerciseFilter {
  @Field({ nullable: true }) search?: string;
  @Field({ nullable: true }) muscle?: string;
  @Field({ nullable: true }) equipment?: string;
  @Field({ nullable: true }) level?: string;
  @Field({ nullable: true }) kind?: string;
  @Field({ nullable: true }) ownerId?: string; // to include private items for coach
}

@InputType()
class UpsertExerciseInput {
  @Field({ nullable: true }) id?: string;
  @Field() title: string;
  @Field() videoUrl: string;
  @Field({ nullable: true }) audioUrl?: string;
  @Field({ nullable: true }) description?: string;
  @Field(() => [String], { nullable: true }) sports?: string[]; // sport ids
  @Field(() => [String], { nullable: true }) equipment?: string[]; // equipment ids
  @Field(() => [String], { nullable: true }) primaryMuscles?: string[]; // muscle ids
  @Field(() => [String], { nullable: true }) secondaryMuscles?: string[]; // muscle ids
  @Field({ nullable: true }) level?: string;
  @Field({ nullable: true }) kind?: string;
  @Field({ nullable: true }) ownerId?: string;
}

@ObjectType()
class UploadResult { @Field() url: string; }

@InputType()
class SearchExercisesInput {
  @Field({nullable:true}) search?: string;
  @Field({nullable:true}) muscle?: string;
  @Field({nullable:true}) muscles?: string; // JSON string array
  @Field({nullable:true}) equipment?: string;
  @Field({nullable:true}) sports?: string; // JSON string array of ids
  @Field({nullable:true}) level?: string;
  @Field({nullable:true}) kind?: string;
  @Field({nullable:true}) minDuration?: number;
  @Field({nullable:true}) maxDuration?: number;
  @Field({nullable:true}) sortBy?: string; // RECENT|DURATION|POPULAR
  @Field({nullable:true}) ownerId?: string;
  @Field({nullable:true}) limit?: number;
  @Field({nullable:true}) cursor?: string;
}

@ObjectType()
class PageInfo { @Field() endCursor:string; @Field() hasNextPage:boolean; }


@ObjectType() class SessionDetailDTO {
  @Field() id:string;
  @Field() date:Date;
  @Field() status:string;
  @Field({nullable:true}) completedAt?:Date;
  @Field() dayIndex:number;
  @Field(() => [PlanBlockDTO]) blocks: PlanBlockDTO[];
}


@ObjectType()
class AnatomyConfigDTO { @Field() id:string; @Field() gender:string; @Field() modelUrl:string; @Field() active:boolean; @Field({nullable:true}) meshMap?: string; }

@InputType()
class UpsertAnatomyInput { @Field({nullable:true}) id?:string; @Field() gender:string; @Field() modelUrl:string; @Field() meshMap:string; @Field({nullable:true}) active?:boolean; }


@Resolver()
export class PlanResolver {


  @Mutation(() => PlanSetLogDTO)
  async logSet(@Args('sessionId') sessionId:string, @Args('planSetId') planSetId:string, @Args('reps') reps:number, @Args('weight', {nullable:true}) weight?:number, @Args('rpe', {nullable:true}) rpe?:number, @Args('note', {nullable:true}) note?:string): Promise<PlanSetLogDTO> {
    const row:any = await prisma.planSetLog.create({ data: { sessionId, planSetId, actualReps: reps, actualWeight: weight||null, rpe: rpe||null, note: note||null } });
    return row as any;
  }

  
  @ObjectType() class ExerciseEdge { @Field() id:string; @Field() title:string; @Field() videoUrl:string; @Field({nullable:true}) thumbnailUrl?:string; @Field({nullable:true}) durationSec?:number; @Field() status:string; @Field({nullable:true}) level?:string; @Field({nullable:true}) kind?:string; @Field({nullable:true}) ownerId?:string; @Field({nullable:true}) muscleGroup?:string; @Field({nullable:true}) equipment?:string; @Field() viewCount:number; @Field() likeCount:number; }
  @ObjectType() class ExerciseConnection { @Field(() => [ExerciseEdge]) edges: ExerciseEdge[]; @Field() total:number; @Field(() => PageInfo) pageInfo: PageInfo; }

  @Query(() => ExerciseConnection)
  async searchExercises(@Args('input', { nullable:true }) input?: SearchExercisesInput): Promise<ExerciseConnection> {
    const key = cacheKey(input);
    const now = Date.now();
    const hit = __searchCache.get(key);
    if (hit && (now - hit.t) < 60000) { return hit.v as any; }

    const where:any = {};
    const take = input?.limit || 20;
    const skip = input?.cursor ? Number(input.cursor) : 0;
    if (input?.ownerId){ where.OR = [{ status:'APPROVED' }, { ownerId: input.ownerId }]; } else { where.status = 'APPROVED'; }
    if (input?.search){ where.title = { contains: input.search, mode:'insensitive' }; }
    if (input?.muscle){ where.primaryMuscles = { some: { code: input.muscle } }; }
    if (input?.muscles){ try{ const arr = JSON.parse(input.muscles||'[]'); where.primaryMuscles = { some: { code: { in: arr } } }; }catch(e){} }
    if (input?.equipment){ where.equipment = { some: { name: input.equipment } }; }
    if (input?.sports){ try{ const arr = JSON.parse(input.sports||'[]'); where.sports = { some: { id: { in: arr } } }; }catch(e){} }
    if (input?.level){ where.level = input.level; }
    if (input?.kind){ where.kind = input.kind; }
    if (input?.minDuration || input?.maxDuration){ where.durationSec = {}; if (input?.minDuration) where.durationSec.gte = input.minDuration; if (input?.maxDuration) where.durationSec.lte = input.maxDuration; }

    let orderBy:any = { updatedAt: 'desc' };
    if (input?.sortBy==='DURATION') orderBy = { durationSec: 'asc' };
    if (input?.sortBy==='POPULAR') orderBy = [{ likeCount:'desc' }, { viewCount:'desc' }, { updatedAt:'desc' }];

    const total = await prisma.exerciseVideo.count({ where });
    const rows = await prisma.exerciseVideo.findMany({ where, take, skip, orderBy, include: { primaryMuscles:true, equipment:true } });
    const edges = rows.map((r:any)=> ({ id:r.id, title:r.title, videoUrl:r.videoUrl, thumbnailUrl:r.thumbnailUrl||null, durationSec:r.durationSec||null, status:r.status, level:r.level, kind:r.kind, ownerId:r.ownerId||undefined, muscleGroup:r.primaryMuscles?.[0]?.code, equipment:r.equipment?.[0]?.name, viewCount:r.viewCount||0, likeCount:r.likeCount||0 }));
    return { edges, total, pageInfo: { endCursor: String(skip + edges.length), hasNextPage: (skip + edges.length) < total } } as any;
  }


  @Mutation(() => Boolean)
  async approveExercise(@Args('id') id:string, @Args('status', {nullable:true}) status?:string, @Context() ctx?:any): Promise<boolean> {
    mustRole(ctx, 'admin');
    const st = status || 'APPROVED';
    await prisma.exerciseVideo.update({ where:{ id }, data:{ status: st } });
    return true;
  }


  @Query(() => [ExerciseStatDTO])
  async topExercises(@Args('limit', {nullable:true}) limit?:number): Promise<ExerciseStatDTO[]> {
    const rows:any[] = await prisma.exerciseVideo.findMany({ where:{ status:'APPROVED' }, orderBy:[{ likeCount:'desc' }, { viewCount:'desc' }], take: limit||10 });
    return rows.map(r=> ({ id:r.id, title:r.title, viewCount:r.viewCount||0, likeCount:r.likeCount||0 })) as any;
  }

  // ---------- Exercises (library) ----------

  @ObjectType() class MultipartInit { @Field() uploadId:string; @Field() key:string; }
  @ObjectType() class MultipartPartURL { @Field() url:string; }


  @Mutation(() => Boolean)
  async autoProgressAssignment(@Args('assignmentId') assignmentId:string, @Args('mode', {nullable:true}) mode?:string): Promise<boolean> {
    // Simple linear progression: if any log exists for a PlanSet, increase targetWeight by +2.5 (or reps +1 up to 12) for next occurrences (same set across future sessions)
    const logs:any[] = await prisma.planSetLog.findMany({ where:{ session: { assignmentId } }, include:{ planSet: true } });
    const bySet = new Map<string, { last:number, set:any }>();
    for (const l of logs){
      bySet.set(l.planSetId, { last: l.actualWeight || l.planSet?.targetWeight || 0, set: l.planSet });
    }
    for (const [setId, obj] of bySet.entries()){
      const inc = (mode==='REPS') ? 1 : 2.5;
      if (mode==='REPS'){
        await prisma.planSet.update({ where:{ id: setId }, data: { reps: Math.min((obj.set.reps||10)+inc, 12) } });
      }else{
        await prisma.planSet.update({ where:{ id: setId }, data: { targetWeight: ((obj.last||0) + inc) } });
      }
    }
    return true;
  }

  @Mutation(() => MultipartInit)
  async createMultipartUpload(@Args('kind') kind:string, @Args('ext') ext:string): Promise<MultipartInit> {
    if (!s3 || !process.env.S3_BUCKET) throw new Error('S3 not configured');
    const key = `${kind}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext||'bin'}`;
    const cmd:any = { Bucket: process.env.S3_BUCKET!, Key: key, ContentType: kind.startsWith('video')? `video/${ext}` : `application/octet-stream` };
    const { CreateMultipartUploadCommand } = await import('@aws-sdk/client-s3');
    const out = await s3.send(new CreateMultipartUploadCommand(cmd));
    return { uploadId: out.UploadId!, key };
  }

  @Mutation(() => MultipartPartURL)
  async signUploadPart(@Args('key') key:string, @Args('uploadId') uploadId:string, @Args('partNumber') partNumber:number): Promise<MultipartPartURL> {
    if (!s3 || !process.env.S3_BUCKET) throw new Error('S3 not configured');
    const { UploadPartCommand } = await import('@aws-sdk/client-s3');
    const sign = new UploadPartCommand({ Bucket: process.env.S3_BUCKET!, Key: key, UploadId: uploadId, PartNumber: partNumber });
    const url = await getSignedUrl(s3, sign, { expiresIn: 900 });
    return { url };
  }

  @Mutation(() => UploadResult)
  async completeMultipartUpload(@Args('key') key:string, @Args('uploadId') uploadId:string, @Args('parts') parts:string): Promise<UploadResult> {
    if (!s3 || !process.env.S3_BUCKET) throw new Error('S3 not configured');
    const list = JSON.parse(parts||'[]');
    const { CompleteMultipartUploadCommand } = await import('@aws-sdk/client-s3');
    const cmd = new CompleteMultipartUploadCommand({ Bucket: process.env.S3_BUCKET!, Key: key, UploadId: uploadId, MultipartUpload: { Parts: list } });
    await s3.send(cmd);
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { url: fileUrl };
  }


  @Mutation(() => ExerciseDTO)
  async processExerciseMedia(@Args('id') id: string): Promise<ExerciseDTO> {
    const ex = await prisma.exerciseVideo.findUnique({ where: { id } });
    if (!ex) throw new Error('exercise not found');
    const uploads = path.join(process.cwd(), 'uploads'); if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
    const tmpVideo = path.join(uploads, `tmp_${id}.mp4`);
    try{
      // download video
      const r = await fetch(ex.videoUrl); const buf = await r.buffer(); fs.writeFileSync(tmpVideo, buf);
      // probe duration
      let duration = 0;
      try{
        const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${tmpVideo}`).toString().trim();
        duration = Math.floor(parseFloat(out)||0);
      }catch(e){}
      // thumbnail at 2s or 30%
      const sec = Math.max(2, Math.floor(duration * 0.3));
      const thumb = path.join(uploads, `thumb_${id}.jpg`);
      try{
        execSync(`ffmpeg -y -ss ${sec} -i ${tmpVideo} -frames:v 1 -q:v 3 ${thumb}`);
      }catch(e){}
      let thumbnailUrl: string | null = null;
      if (fs.existsSync(thumb)){
        if (s3 && process.env.S3_BUCKET){
          const key = `thumbs/${id}.jpg`;
          const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, Body: fs.readFileSync(thumb), ContentType: 'image/jpeg' });
          await s3.send(cmd);
          thumbnailUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } else {
          thumbnailUrl = `/uploads/${path.basename(thumb)}`;
        }
      }
      await prisma.exerciseVideo.update({ where:{ id }, data: { durationSec: duration||null, thumbnailUrl } });
      return await prisma.exerciseVideo.findUnique({ where:{ id } }) as any;
    } finally {
      try{ fs.unlinkSync(tmpVideo); }catch(e){}
    }
  }

  @Query(() => ExercisesPage)
  async exercises(
    @Args('search', { nullable: true }) search?: string,
    @Args('muscle', { nullable: true }) muscle?: string,
    @Args('equipment', { nullable: true }) equipment?: string,
    @Args('cursor', { nullable: true }) cursor?: string,
    @Args('limit', { nullable: true }) limit: number = 20,
    @Args('ownerId', { nullable: true }) ownerId?: string,
  ): Promise<ExercisesPage> {
    const where:any = { status: 'APPROVED' };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (ownerId) where.OR = [{ status: 'APPROVED' }, { ownerId }];
    // In a real impl, join tables for muscles/equipment
    const total = await prisma.exerciseVideo.count({ where });
    const rows = await prisma.exerciseVideo.findMany({ where, take: limit, skip: cursor? Number(cursor) : 0, orderBy: { updatedAt: 'desc' },
      include: { primaryMuscles: true, equipment: true } });
    const edges = rows.map((r:any)=> ({ id: r.id, title: r.title, videoUrl: r.videoUrl, audioUrl: r.audioUrl, description: r.description, level: r.level, kind: r.kind, ownerId: r.ownerId||undefined, status: r.status, media: r.videoUrl, muscleGroup: r.primaryMuscles?.[0]?.code, equipment: r.equipment?.[0]?.name }));
    const endCursor = String((cursor? Number(cursor):0) + rows.length);
    return { edges, pageInfo: { endCursor, hasNextPage: (rows.length + (cursor? Number(cursor):0)) < total }, total };
  }

  @Mutation(() => ExerciseDTO)
  async upsertExercise(@Args('input') input: UpsertExerciseInput): Promise<ExerciseDTO> {
    const { id, sports, equipment, primaryMuscles, secondaryMuscles, ...data } = input as any;
    const make = (ids?:string[])=> (ids&&ids.length) ? { connect: ids.map((id:string)=> ({ id })) } : undefined;
    const row = await prisma.exerciseVideo.upsert({
      where: { id: id || '00000000-0000-0000-0000-000000000000' },
      update: { ...data,
        sports: sports? { set: (sports||[]).map((id:string)=> ({ id })) } : undefined,
        equipment: equipment? { set: (equipment||[]).map((id:string)=> ({ id })) } : undefined,
        primaryMuscles: primaryMuscles? { set: (primaryMuscles||[]).map((id:string)=> ({ id })) } : undefined,
        secondaryMuscles: secondaryMuscles? { set: (secondaryMuscles||[]).map((id:string)=> ({ id })) } : undefined,
      },
      create: { ...data,
        sports: make(sports),
        equipment: make(equipment),
        primaryMuscles: make(primaryMuscles),
        secondaryMuscles: make(secondaryMuscles),
      },
      include: { primaryMuscles:true, equipment:true }
    });
    try{ await enqueueMediaProcessing(row.id); }catch(e){}
    return row as any;
  }

  @Mutation(() => ExerciseDTO)
  async reviewExercise(@Args('id') id: string, @Args('status') status: string): Promise<ExerciseDTO> {
    const row = await prisma.exerciseVideo.update({ where: { id }, data: { status } });
    try{ await enqueueMediaProcessing(row.id); }catch(e){}
    return row as any;
  }

  @Mutation(() => UploadResult)
  async requestUploadUrl(@Args('kind') kind: string, @Args('ext') ext: string): Promise<UploadResult> {
    if (!s3 || !process.env.S3_BUCKET) throw new Error('S3 not configured');
    const key = `${kind}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext||'bin'}`;
    const put = new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, ContentType: kind.startsWith('video')? `video/${ext}` : `audio/${ext}` });
    const uploadUrl = await getSignedUrl(s3, put, { expiresIn: 900 });
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return { url: JSON.stringify({ uploadUrl, fileUrl, key }) } as any;
  }

  @Mutation(() => UploadResult)
  async uploadVoice(@Args('data') data: string, @Args('ext') ext: string): Promise<UploadResult> {
    const buf = Buffer.from(data, 'base64');
    const name = `voice_${Date.now()}.${ext||'m4a'}`;
    const p = path.join(UPLOAD_DIR, name);
    fs.writeFileSync(p, buf);
    return { url: `/uploads/${name}` };
  }


  // ---------- Taxonomy ----------
  @ObjectType() class SportDTO { @Field() id:string; @Field() name:string; }
  @ObjectType() class EquipmentDTO { @Field() id:string; @Field() name:string; }
  @ObjectType() class MuscleDTO { @Field() id:string; @Field() code:string; @Field() name:string; }

  @Query(() => [SportDTO]) async sports(): Promise<SportDTO[]> { return await prisma.sport.findMany(); }
  @Query(() => [EquipmentDTO]) async equipmentCatalogs(): Promise<EquipmentDTO[]> { return await prisma.equipmentCatalog.findMany(); }
  @Query(() => [MuscleDTO]) async muscles(): Promise<MuscleDTO[]> { return await prisma.muscle.findMany(); }

  @Mutation(() => SportDTO) async upsertSport(@Args('id', {nullable:true}) id:string, @Args('name') name:string): Promise<SportDTO> { return await prisma.sport.upsert({ where:{ id: id||'00000000-0000-0000-0000-000000000000' }, update:{ name }, create:{ name } }); }
  @Mutation(() => EquipmentDTO) async upsertEquipment(@Args('id', {nullable:true}) id:string, @Args('name') name:string): Promise<EquipmentDTO> { return await prisma.equipmentCatalog.upsert({ where:{ id: id||'00000000-0000-0000-0000-000000000000' }, update:{ name }, create:{ name } }); }
  @Mutation(() => MuscleDTO) async upsertMuscle(@Args('id', {nullable:true}) id:string, @Args('code') code:string, @Args('name') name:string): Promise<MuscleDTO> { return await prisma.muscle.upsert({ where:{ id: id||'00000000-0000-0000-0000-000000000000' }, update:{ code, name }, create:{ code, name } }); }


  
  // ---------- Anatomy Config ----------
  @Query(() => AnatomyConfigDTO, { nullable:true })
  async anatomyConfig(@Args('gender') gender:string): Promise<AnatomyConfigDTO|null> {
    const row:any = await prisma.anatomyConfig.findFirst({ where:{ gender, active: true }, orderBy:{ updatedAt:'desc' } });
    if (!row) return null;
    return { ...row, meshMap: JSON.stringify(row.meshMap||{}) } as any;
  }

  @Mutation(() => AnatomyConfigDTO)
  async upsertAnatomyConfig(@Args('input') input: UpsertAnatomyInput): Promise<AnatomyConfigDTO> {
    const { id, gender, modelUrl, meshMap, active } = input as any;
    const data:any = { gender, modelUrl, meshMap: JSON.parse(meshMap||'{}') };
    if (typeof active === 'boolean') data.active = active;
    const row:any = await prisma.anatomyConfig.upsert({ where: { id: id||'00000000-0000-0000-0000-000000000000' }, update: data, create: data });
    return { ...row, meshMap: JSON.stringify(row.meshMap||{}) } as any;
  }




  @Query(() => SessionSimDTO)
  async simulateSession(@Args('sessionId') sessionId:string): Promise<SessionSimDTO> {
    const s:any = await prisma.planSession.findUnique({ where:{ id: sessionId }, include:{ assignment:true } });
    if (!s) throw new Error('not found');
    const plan:any = await prisma.plan.findUnique({ where:{ id: s.assignment.planId }, include:{ days:{ include:{ blocks:{ include:{ items:{ include:{ sets:true } } } } } } } });
    const day = plan?.days?.[s.dayIndex]; if (!day) throw new Error('day not found');
    const blocks: any[] = [];
    let total = 0;
    for (const b of day.blocks){
      const t = (b.type||'SINGLE').toUpperCase();
      let sec = 0;
      if (b.protocol==='EMOM'){ sec = (b.protocolParams?.minutes||20)*60; }
      else if (b.protocol==='HIIT'){ sec = (b.protocolParams?.rounds||8) * ((b.protocolParams?.work||20) + (b.protocolParams?.rest||10)); }
      else {
        // estimate: sum(sets * (tempo 3s/rep + 1s transition)) + rest
        let setsCount = 0; let restSum = 0; let repsSum = 0;
        for (const it of b.items){ for (const st of it.sets){ setsCount++; repsSum += (st.reps||10); restSum += (st.rest||60); } }
        const timePerRep = 3; const trans = 1;
        sec = (repsSum * timePerRep) + (setsCount * trans) + restSum;
        if (t!=='SINGLE'){ // superset/triset/circuit add transitions
          sec += ((b.items?.length||1)-1) * (b.restBetweenItemsSec||30) * (b.rounds||1);
        }
      }
      blocks.push({ blockId: b.id, seconds: sec, rounds: b.rounds||null });
      total += sec;
    }
    return { sessionId, totalSeconds: total, blocks } as any;
  }


  @Query(() => [LoadPointDTO])
  async trainingLoadByWeek(@Args('clientId') clientId:string, @Args('weeks', {nullable:true}) weeks?: number): Promise<LoadPointDTO[]> {
    const n = weeks||8;
    const end = new Date(); end.setHours(23,59,59,999);
    const start = new Date(end); start.setDate(end.getDate() - (n*7));
    const sessions:any[] = await prisma.planSession.findMany({ where:{ clientId, date:{ gte: start, lte: end } } as any });
    const logs:any[] = await prisma.planSetLog.findMany({ where:{ sessionId: { in: sessions.map(s=> s.id) } } });
    const map = new Map<string, number>();
    for (const l of logs){
      const s = sessions.find(x=> x.id===l.sessionId); if (!s) continue;
      const d = new Date(s.date); const year = d.getFullYear(); const onejan = new Date(d.getFullYear(),0,1); const week = Math.ceil((((d as any) - (onejan as any)) / 86400000 + onejan.getDay()+1)/7);
      const key = `${year}-W${String(week).padStart(2,'0')}`;
      const load = (l.actualReps||0) * (l.actualWeight||1);
      map.set(key, (map.get(key)||0) + load);
    }
    return Array.from(map.entries()).sort((a,b)=> a[0].localeCompare(b[0])).map(([week, load])=> ({ week, load }));
  }


  @Mutation(() => Boolean)
  async reorderBlockItems(@Args('blockId') blockId:string, @Args({ name:'orderedIds', type: () => [String] }) orderedIds:string[], @Context() ctx?:any): Promise<boolean> {
    mustRole(ctx, 'coach');
    for (let i=0;i<orderedIds.length;i++){ await prisma.planBlockItem.update({ where:{ id: orderedIds[i] }, data:{ order: i } }); }
    return true;
  }

  @Mutation(() => Boolean)
  async reorderItemSets(@Args('itemId') itemId:string, @Args({ name:'orderedIds', type: () => [String] }) orderedIds:string[], @Context() ctx?:any): Promise<boolean> {
    mustRole(ctx, 'coach');
    for (let i=0;i<orderedIds.length;i++){ await prisma.planSet.update({ where:{ id: orderedIds[i] }, data:{ order: i } }); }
    return true;
  }

  @Mutation(() => Boolean)
  async exerciseView(@Args('id') id:string): Promise<boolean> {
    await prisma.exerciseVideo.update({ where:{ id }, data: { viewCount: { increment: 1 } } });
    return true;
  }
  @Mutation(() => Boolean)
  async exerciseLike(@Args('id') id:string, @Args('delta', {nullable:true}) delta?: number): Promise<boolean> {
    await prisma.exerciseVideo.update({ where:{ id }, data: { likeCount: { increment: delta || 1 } } });
    return true;
  }

  // ---------- Plans ----------

  @Query(()=> String)
  async getAssignedPlan(@Args('id') id:string, @Context() ctx:any): Promise<string> {
    mustAny(ctx, ['coach','specialist','user','admin']);
    const a:any = await prisma.planAssignment.findUnique({ where:{ id } });
    if (!a) throw new Error('assignment not found');
    const plan:any = await prisma.plan.findUnique({ where:{ id: a.planId } });
    return plan?.json || '{}';
  }

  @Mutation(()=> Boolean)
  async logCorrectiveCheck(@Args('assignmentId') assignmentId:string, @Args('dayIndex') dayIndex:number, @Args('itemKey') itemKey:string, @Args('value') value:string, @Context() ctx:any): Promise<boolean> {
    mustAny(ctx, ['user','coach','specialist','admin']);
    await prisma.correctiveProgress.create({ data:{ assignmentId, dayIndex, itemKey, value } as any });
    return true;
  }


  @Mutation(()=> String)
  async createCorrectivePlan(@Args('title') title:string, @Args('daysJson') daysJson:string, @Context() ctx:any): Promise<string> {
    mustRole(ctx, 'specialist');
    const by = ctxUser(ctx) || 'unknown';
    const plan = await prisma.plan.create({ data:{ title, kind: 'CORRECTIVE' as any, createdBy: by, json: daysJson } as any });
    return (plan as any).id;
  }

  @Mutation(()=> String)
  async assignPlanToUser(@Args('planId') planId:string, @Args('userId') userId:string, @Args('startDate') startDate:string, @Args('sessionsPerWeek',{nullable:true}) sessionsPerWeek?:number, @Context() ctx:any): Promise<string>{
    mustAny(ctx, ['coach','specialist','admin']);
    const a = await prisma.planAssignment.create({ data:{ planId, userId, startDate: new Date(startDate), sessionsPerWeek: sessionsPerWeek||3 } as any });
    return (a as any).id;
  }


  @Mutation(() => String)
  async createComplexBlock(@Args('input') input: ComplexBlockInput, @Context() ctx?:any): Promise<string> {
    mustRole(ctx, 'coach');
    const { dayId, section, type, exerciseIds, rounds, restBetweenItemsSec, protocol, params } = input;
    const protoParams = params? JSON.parse(params): null; validateProtocolParams(protocol, protoParams);
    const itemsCount = (exerciseIds||[]).length;
    const T = String(type||'SINGLE').toUpperCase();
    const min = T==='TRISET'?3 : (T==='SUPERSET'||T==='CIRCUIT'?2:1);
    if (itemsCount < min) throw new Error(`at least ${min} exercises required for ${T}`);
    const result = await prisma.$transaction(async(tx)=>{
      const created:any = await tx.planBlock.create({ data:{ dayId, section, type, rounds: rounds||null, restBetweenItemsSec: restBetweenItemsSec||null, protocol: protocol||null, protocolParams: protoParams, order: 999 } as any });
      let order = 0;
      for (const exId of (exerciseIds||[])){
        const item:any = await tx.planBlockItem.create({ data:{ blockId: created.id, order: order++, exerciseId: exId, note: '' } as any });
      const item = await prisma.planBlockItem.create({ data:{ blockId: block.id, order: order++, exerciseId: exId, note: '' } as any });
      // default one set for combo blocks, 3x10 for single blocks
      if ((type||'SINGLE').toUpperCase()==='SINGLE'){
        for (let i=0;i<3;i++){
          await prisma.planSet.create({ data:{ itemId: item.id, order:i, reps:10, rest:60 } as any });
        }
      } else {
        await prisma.planSet.create({ data:{ itemId: item.id, order:0, reps:10, rest:30 } as any });
      }
    }
    // normalize orders
    const blocks = await prisma.planBlock.findMany({ where:{ dayId }, orderBy:{ order:'asc' } });
    let idx = 0;
    for (const b of blocks){ await tx.planBlock.update({ where:{ id:b.id }, data:{ order: idx++ } }); }
      return created.id;
    });
    return result;
  }


  @Query(() => PlanDayDTO, { nullable:true })
  async planDayById(@Args('dayId') dayId:string): Promise<PlanDayDTO|null> {
    const d:any = await prisma.planDay.findUnique({ where:{ id: dayId }, include:{ blocks:{ include:{ items:{ include:{ sets:true } } } } } });
    return d as any;
  }


  @Mutation(() => Boolean)
  async applyProtocol(@Args('blockId') blockId:string, @Args('protocol') protocol:string, @Args('params', {nullable:true}) params?:string): Promise<boolean> {
    const p:any = params? JSON.parse(params): {};
    const b:any = await prisma.planBlock.findUnique({ where:{ id:blockId }, include:{ items:{ include:{ sets:true } } } });
    if (!b) throw new Error('block not found');
    // normalize
    const proto = (protocol||'').toUpperCase();
    // clear previous sets
    for (const it of b.items){ await prisma.planSet.deleteMany({ where:{ itemId: it.id } }); }
    if (proto==='5X5' || proto==='5x5'){
      for (const it of b.items){ for (let i=0;i<5;i++){ await prisma.planSet.create({ data:{ itemId: it.id, order:i, reps:5, rest: p.rest||120, targetWeight: p.weight||null, targetRPE: p.rpe||null } }); } }
      await prisma.planBlock.update({ where:{ id:blockId }, data:{ protocol:'FIVExFIVE', protocolParams:p } });
    } else if (proto==='GVT'){
      for (const it of b.items){ for (let i=0;i<10;i++){ await prisma.planSet.create({ data:{ itemId: it.id, order:i, reps:10, rest: p.rest||60 } }); } }
      await prisma.planBlock.update({ where:{ id:blockId }, data:{ protocol:'GVT', protocolParams:p } });
    } else if (proto==='EMOM'){
      const minutes = p.minutes||20; // block-level timer
      await prisma.planBlock.update({ where:{ id:blockId }, data:{ protocol:'EMOM', protocolParams:{ minutes, every:60, ...(p||{}) } } });
    } else if (proto==='HIIT'){
      const rounds = p.rounds||8;
      await prisma.planBlock.update({ where:{ id:blockId }, data:{ protocol:'HIIT', protocolParams:{ rounds, work: p.work||20, rest: p.rest||10 } } });
    } else {
      throw new Error('unsupported protocol');
    }
    return true;
  }



  @Mutation(() => Boolean)
  async reorderPlanBlocks(@Args('dayId') dayId:string, @Args('orderedIds', { type: () => [String] }) orderedIds:string[]): Promise<boolean> {
    for (let i=0;i<orderedIds.length;i++){ await prisma.planBlock.update({ where:{ id: orderedIds[i] }, data: { order: i } }); }
    return true;
  }
  @Mutation(() => Boolean)
  async reorderPlanItems(@Args('blockId') blockId:string, @Args('orderedIds', { type: () => [String] }) orderedIds:string[]): Promise<boolean> {
    for (let i=0;i<orderedIds.length;i++){ await prisma.planBlockItem.update({ where:{ id: orderedIds[i] }, data: { order: i } }); }
    return true;
  }
  @Mutation(() => String)
  async duplicateBlock(@Args('blockId') blockId:string): Promise<string> {
    const b:any = await prisma.planBlock.findUnique({ where:{ id:blockId }, include:{ items:{ include:{ sets:true } } } });
    if (!b) throw new Error('block not found');
    const nb = await prisma.planBlock.create({ data:{ dayId:b.dayId, order:b.order+1, type:b.type, section:b.section, protocol:b.protocol, protocolParams:b.protocolParams } });
    let ord = 0;
    for (const it of b.items){
      const ni = await prisma.planBlockItem.create({ data:{ blockId: nb.id, order: ord++, exerciseId: it.exerciseId, note: it.note } });
      for (const s of it.sets){
        await prisma.planSet.create({ data:{ itemId: ni.id, order: s.order, reps: s.reps, rest: s.rest, targetWeight: s.targetWeight, targetRPE: s.targetRPE } });
      }
    }
    return nb.id;
  }
  @Mutation(() => String)
  async duplicateDay(@Args('dayId') dayId:string): Promise<string> {
    const d:any = await prisma.planDay.findUnique({ where:{ id:dayId }, include:{ blocks:{ include:{ items:{ include:{ sets:true } } } } } });
    if (!d) throw new Error('day not found');
    const nd = await prisma.planDay.create({ data:{ planId:d.planId, order:d.order+1, title: d.title } });
    let bOrd=0;
    for (const b of d.blocks){
      const nb = await prisma.planBlock.create({ data:{ dayId: nd.id, order:bOrd++, type:b.type, section:b.section, protocol:b.protocol, protocolParams:b.protocolParams } });
      let iOrd=0;
      for (const it of b.items){
        const ni = await prisma.planBlockItem.create({ data:{ blockId: nb.id, order: iOrd++, exerciseId: it.exerciseId, note: it.note } });
        for (const s of it.sets){
          await prisma.planSet.create({ data:{ itemId: ni.id, order: s.order, reps: s.reps, rest: s.rest, targetWeight: s.targetWeight, targetRPE: s.targetRPE } });
        }
      }
    }
    return nd.id;
  }


  @Mutation(() => Boolean)
  async updateBlockMeta(@Args('blockId') blockId:string, @Args('section', {nullable:true}) section?:string, @Args('type', {nullable:true}) type?:string, @Args('rounds', {nullable:true}) rounds?:number, @Args('restBetweenItemsSec', {nullable:true}) restBetweenItemsSec?:number): Promise<boolean> {
    const data:any = {};
    if (section !== undefined) data.section = section;
    if (type !== undefined) data.type = type;
    if (rounds !== undefined) data.rounds = rounds;
    if (restBetweenItemsSec !== undefined) data.restBetweenItemsSec = restBetweenItemsSec;
    await prisma.planBlock.update({ where:{ id: blockId }, data });
    return true;
  }


  @Query(() => [PlanSessionNoteDTO])
  async sessionNotes(@Args('sessionId') sessionId:string): Promise<PlanSessionNoteDTO[]> {
    const rows:any[] = await prisma.planSessionNote.findMany({ where:{ sessionId }, orderBy:{ createdAt:'desc' } });
     __searchCache.set(key, { t: Date.now(), v: rows }); return rows as any;
  }

  @Mutation(() => PlanSessionNoteDTO)
  async upsertSessionNote(@Args('input') input: UpsertSessionNoteInput, @Context() ctx?:any): Promise<PlanSessionNoteDTO> {
    const role = (input.role || ctxRole(ctx) || 'user').toString().toUpperCase();
    const authorId = input.authorId || ctxUser(ctx);
    const row:any = await prisma.planSessionNote.create({ data: { sessionId: input.sessionId, role, authorId, text: input.text||null, audioUrl: input.audioUrl||null } });
    return row as any;
  }


  @Mutation(() => Boolean)
  async bulkAddItemsToBlock(@Args('blockId') blockId:string, @Args({ name:'exerciseIds', type: () => [String] }) exerciseIds:string[], @Context() ctx?:any): Promise<boolean> {
    mustRole(ctx, 'coach');
    const b:any = await prisma.planBlock.findUnique({ where:{ id:blockId } });
    if (!b) throw new Error('block not found');
    let order = await prisma.planBlockItem.count({ where:{ blockId } });
    for (const exId of exerciseIds||[]){
      const item = await prisma.planBlockItem.create({ data:{ blockId, order: order++, exerciseId: exId, note: '' } as any });
      if ((b.type||'SINGLE').toUpperCase()==='SINGLE'){
        for (let i=0;i<3;i++){ await prisma.planSet.create({ data:{ itemId: item.id, order:i, reps:10, rest:60 } as any }); }
      } else {
        await prisma.planSet.create({ data:{ itemId: item.id, order:0, reps:10, rest:30 } as any });
      }
    }
    return true;
  }

  @Mutation(() => SessionDetailDTO)
  async startSession(@Args('sessionId') sessionId:string): Promise<SessionDetailDTO> {
    const s = await prisma.planSession.update({ where:{ id: sessionId }, data: { status:'IN_PROGRESS' } });
    return await this.sessionDetail(sessionId) as any;
  }


  @Mutation(() => Boolean)
  async reorderPlanBlocks(@Args('dayId') dayId:string, @Args('orderedIds', { type: () => [String] }) orderedIds:string[]): Promise<boolean> {
    for (let i=0;i<orderedIds.length;i++){ await prisma.planBlock.update({ where:{ id: orderedIds[i] }, data: { order: i } }); }
    return true;
  }
  @Mutation(() => Boolean)
  async reorderPlanItems(@Args('blockId') blockId:string, @Args('orderedIds', { type: () => [String] }) orderedIds:string[]): Promise<boolean> {
    for (let i=0;i<orderedIds.length;i++){ await prisma.planBlockItem.update({ where:{ id: orderedIds[i] }, data: { order: i } }); }
    return true;
  }
  @Mutation(() => String)
  async duplicateBlock(@Args('blockId') blockId:string): Promise<string> {
    const b:any = await prisma.planBlock.findUnique({ where:{ id:blockId }, include:{ items:{ include:{ sets:true } } } });
    if (!b) throw new Error('block not found');
    const nb = await prisma.planBlock.create({ data:{ dayId:b.dayId, order:b.order+1, type:b.type, section:b.section, protocol:b.protocol, protocolParams:b.protocolParams } });
    let ord = 0;
    for (const it of b.items){
      const ni = await prisma.planBlockItem.create({ data:{ blockId: nb.id, order: ord++, exerciseId: it.exerciseId, note: it.note } });
      for (const s of it.sets){
        await prisma.planSet.create({ data:{ itemId: ni.id, order: s.order, reps: s.reps, rest: s.rest, targetWeight: s.targetWeight, targetRPE: s.targetRPE } });
      }
    }
    return nb.id;
  }
  @Mutation(() => String)
  async duplicateDay(@Args('dayId') dayId:string): Promise<string> {
    const d:any = await prisma.planDay.findUnique({ where:{ id:dayId }, include:{ blocks:{ include:{ items:{ include:{ sets:true } } } } } });
    if (!d) throw new Error('day not found');
    const nd = await prisma.planDay.create({ data:{ planId:d.planId, order:d.order+1, title: d.title } });
    let bOrd=0;
    for (const b of d.blocks){
      const nb = await prisma.planBlock.create({ data:{ dayId: nd.id, order:bOrd++, type:b.type, section:b.section, protocol:b.protocol, protocolParams:b.protocolParams } });
      let iOrd=0;
      for (const it of b.items){
        const ni = await prisma.planBlockItem.create({ data:{ blockId: nb.id, order: iOrd++, exerciseId: it.exerciseId, note: it.note } });
        for (const s of it.sets){
          await prisma.planSet.create({ data:{ itemId: ni.id, order: s.order, reps: s.reps, rest: s.rest, targetWeight: s.targetWeight, targetRPE: s.targetRPE } });
        }
      }
    }
    return nd.id;
  }


  @Mutation(() => Boolean)
  async updateBlockMeta(@Args('blockId') blockId:string, @Args('section', {nullable:true}) section?:string, @Args('type', {nullable:true}) type?:string, @Args('rounds', {nullable:true}) rounds?:number, @Args('restBetweenItemsSec', {nullable:true}) restBetweenItemsSec?:number): Promise<boolean> {
    const data:any = {};
    if (section !== undefined) data.section = section;
    if (type !== undefined) data.type = type;
    if (rounds !== undefined) data.rounds = rounds;
    if (restBetweenItemsSec !== undefined) data.restBetweenItemsSec = restBetweenItemsSec;
    await prisma.planBlock.update({ where:{ id: blockId }, data });
    return true;
  }


  @Query(() => [PlanSessionNoteDTO])
  async sessionNotes(@Args('sessionId') sessionId:string): Promise<PlanSessionNoteDTO[]> {
    const rows:any[] = await prisma.planSessionNote.findMany({ where:{ sessionId }, orderBy:{ createdAt:'desc' } });
     __searchCache.set(key, { t: Date.now(), v: rows }); return rows as any;
  }

  @Mutation(() => PlanSessionNoteDTO)
  async upsertSessionNote(@Args('input') input: UpsertSessionNoteInput, @Context() ctx?:any): Promise<PlanSessionNoteDTO> {
    const role = (input.role || ctxRole(ctx) || 'user').toString().toUpperCase();
    const authorId = input.authorId || ctxUser(ctx);
    const row:any = await prisma.planSessionNote.create({ data: { sessionId: input.sessionId, role, authorId, text: input.text||null, audioUrl: input.audioUrl||null } });
    return row as any;
  }


  @Mutation(() => Boolean)
  async bulkAddItemsToBlock(@Args('blockId') blockId:string, @Args({ name:'exerciseIds', type: () => [String] }) exerciseIds:string[], @Context() ctx?:any): Promise<boolean> {
    mustRole(ctx, 'coach');
    const b:any = await prisma.planBlock.findUnique({ where:{ id:blockId } });
    if (!b) throw new Error('block not found');
    let order = await prisma.planBlockItem.count({ where:{ blockId } });
    for (const exId of exerciseIds||[]){
      const item = await prisma.planBlockItem.create({ data:{ blockId, order: order++, exerciseId: exId, note: '' } as any });
      if ((b.type||'SINGLE').toUpperCase()==='SINGLE'){
        for (let i=0;i<3;i++){ await prisma.planSet.create({ data:{ itemId: item.id, order:i, reps:10, rest:60 } as any }); }
      } else {
        await prisma.planSet.create({ data:{ itemId: item.id, order:0, reps:10, rest:30 } as any });
      }
    }
    return true;
  }

  @Mutation(() => SessionDetailDTO)
  async completeSession(@Args('sessionId') sessionId:string): Promise<SessionDetailDTO> {
    const s = await prisma.planSession.update({ where:{ id: sessionId }, data: { status:'COMPLETED', completedAt: new Date() } });
    return await this.sessionDetail(sessionId) as any;
  }


  @Mutation(() => PlanDTO)
  async createPlanFromTemplate(@Args('template') template:string, @Args('ownerId') ownerId:string, @Args('title', {nullable:true}) title?:string, @Args('description', {nullable:true}) description?:string): Promise<PlanDTO> {
    const p:any = await buildPlanFromTemplate(template as any, ownerId, title||undefined, description||undefined);
    return p as any;
  }

  @ObjectType() class PlanSetDTO { @Field({nullable:true}) targetWeight?: number; @Field({nullable:true}) targetRPE?: number; @Field({nullable:true}) reps?: number; @Field({nullable:true}) weight?: number; @Field({nullable:true}) rest?: number; @Field({nullable:true}) tempo?: string; @Field({nullable:true}) rpe?: number; @Field({nullable:true}) durationSec?: number; }
  @ObjectType() class PlanItemDTO { @Field() id: string; @Field() order: number; @Field() exerciseId: string; @Field({nullable:true}) note?: string; @Field(() => [PlanSetDTO]) sets: PlanSetDTO[]; }
  @ObjectType() class PlanBlockDTO { @Field({nullable:true}) section?: string; @Field() id: string; @Field() order: number; @Field() type: string; @Field({nullable:true}) protocol?: string; @Field({nullable:true}) protocolParams?: string; @Field({nullable:true}) restBetweenItems?: number; @Field(() => [PlanItemDTO]) items: PlanItemDTO[]; }
  @ObjectType() class PlanDayDTO { @Field() id: string; @Field() order: number; @Field({nullable:true}) title?: string; @Field({nullable:true}) note?: string; @Field({nullable:true}) voiceUrl?: string; @Field(() => [PlanBlockDTO]) blocks: PlanBlockDTO[]; }
  @ObjectType() class PlanDTO { @Field() id: string; @Field() title: string; @Field({nullable:true}) description?: string; @Field() status: string; @Field() version: number; @Field(() => [PlanDayDTO]) days: PlanDayDTO[]; @Field() updatedAt: Date; }

  @Query(() => PlanDTO, { nullable: true })
  async plan(@Args('id') id: string): Promise<PlanDTO | null> {
    const p = await prisma.plan.findUnique({ where: { id }, include: { days: { orderBy: { order: 'asc' }, include: { blocks: { orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' }, include: { sets: { orderBy: { order: 'asc' } } } } } } } } } });
    return p as any;
  }

  @Query(() => ExercisesPage)
  async plans(@Args('cursor', { nullable: true }) cursor?: string, @Args('limit', { nullable: true }) limit: number = 20, @Args('search', { nullable: true }) search?: string): Promise<ExercisesPage> {
    const where:any = search ? { title: { contains: search, mode: 'insensitive' } } : {};
    const total = await prisma.plan.count({ where });
    const rows = await prisma.plan.findMany({ where, take: limit, skip: cursor? Number(cursor):0, orderBy: { updatedAt: 'desc' } });
    const edges:any = rows.map(r=> ({ id: r.id, title: r.title, description: r.description||'', status: r.status, version: r.version, updatedAt: r.updatedAt, assignedCount: 0 }));
    const endCursor = String((cursor? Number(cursor):0) + rows.length);
    return { edges, pageInfo: { endCursor, hasNextPage: (rows.length + (cursor? Number(cursor):0)) < total }, total } as any;
  }

  @InputType() class PlanSetInput { @Field({nullable:true}) reps?: number; @Field({nullable:true}) weight?: number; @Field({nullable:true}) rest?: number; @Field({nullable:true}) tempo?: string; @Field({nullable:true}) rpe?: number; @Field({nullable:true}) durationSec?: number; }
  @InputType() class PlanItemInput { @Field({nullable:true}) id?: string; @Field() order: number; @Field() exerciseId: string; @Field({nullable:true}) note?: string; @Field(() => [PlanSetInput]) sets: PlanSetInput[]; }
  @InputType() class PlanBlockInput { @Field({nullable:true}) section?: string; @Field({nullable:true}) id?: string; @Field() order: number; @Field() type: string; @Field({nullable:true}) protocol?: string; @Field({nullable:true}) protocolParams?: string; @Field({nullable:true}) restBetweenItems?: number; @Field(() => [PlanItemInput]) items: PlanItemInput[]; }
  @InputType() class PlanDayInput { @Field({nullable:true}) id?: string; @Field() order: number; @Field({nullable:true}) title?: string; @Field({nullable:true}) note?: string; @Field({nullable:true}) voiceUrl?: string; @Field(() => [PlanBlockInput]) blocks: PlanBlockInput[]; }
  @InputType() class UpsertPlanInput { @Field({nullable:true}) id?: string; @Field() title: string; @Field({nullable:true}) description?: string; @Field(() => [PlanDayInput]) days: PlanDayInput[]; @Field() ownerId: string; }

  @Mutation(() => PlanDTO)
  async upsertPlan(@Args('input') input: UpsertPlanInput): Promise<PlanDTO> {
    const { id, title, description, days, ownerId } = input as any;
    let planId = id;
    if (!planId){
      const p = await prisma.plan.create({ data: { title, description, ownerId } });
      planId = p.id;
    } else {
      await prisma.plan.update({ where: { id: planId }, data: { title, description } });
      // clear children (simple approach for brevity)
      const d = await prisma.planDay.findMany({ where: { planId } });
      for (const day of d){
        const blocks = await prisma.planBlock.findMany({ where: { dayId: day.id } });
        for (const b of blocks){
          await prisma.planSet.deleteMany({ where: { item: { blockId: b.id } } });
          await prisma.planBlockItem.deleteMany({ where: { blockId: b.id } });
        }
        await prisma.planBlock.deleteMany({ where: { dayId: day.id } });
      }
      await prisma.planDay.deleteMany({ where: { planId } });
    }
    for (const di in days){
      const d = days[di]; const day = await prisma.planDay.create({ data: { planId, order: d.order, title: d.title||null, note: d.note||null, voiceUrl: d.voiceUrl||null } });
      for (const bi in (d.blocks||[])){
        const b = d.blocks[bi];
        const block = await prisma.planBlock.create({ data: { dayId: day.id, order: b.order, type: (b.type||'SINGLE') as any, protocol: b.protocol||null, protocolParams: b.protocolParams? JSON.parse(b.protocolParams): null, restBetweenItems: b.restBetweenItems||null } });
        for (const ii in (b.items||[])){
          const it = b.items[ii];
          const item = await prisma.planBlockItem.create({ data: { blockId: block.id, order: it.order, exerciseId: it.exerciseId, note: it.note||null } });
          for (const si in (it.sets||[])){
            const s = it.sets[si];
            await prisma.planSet.create({ data: { itemId: item.id, order: Number(si), reps: s.reps||null, weight: s.weight||null, rest: s.rest||null, tempo: s.tempo||null, rpe: s.rpe||null, durationSec: s.durationSec||null } });
          }
        }
      }
    }
    const plan = await prisma.plan.findUnique({ where: { id: planId }, include: { days: { orderBy: { order: 'asc' }, include: { blocks: { orderBy: { order: 'asc' }, include: { items: { orderBy: { order: 'asc' }, include: { sets: { orderBy: { order: 'asc' } } } } } } } } } });
    return plan as any;
  }

  @Mutation(() => PlanDTO)
  async publishPlan(@Args('id') id: string): Promise<PlanDTO> {
    const p = await prisma.plan.update({ where: { id }, data: { status: 'PUBLISHED', version: { increment: 1 } } });
    return p as any;
  }

  @Mutation(() => PlanDTO)
  async duplicatePlan(@Args('id') id: string): Promise<PlanDTO> {
    const p:any = await this.plan(id);
    const clone = await prisma.plan.create({ data: { title: `کپی از ${p.title}`, description: p.description, ownerId: p.ownerId } });
    for (const d of p.days){
      const nd = await prisma.planDay.create({ data: { planId: clone.id, order: d.order, title: d.title, note: d.note, voiceUrl: d.voiceUrl } });
      for (const b of d.blocks){
        const nb = await prisma.planBlock.create({ data: { dayId: nd.id, order: b.order, type: b.type as any, protocol: b.protocol, protocolParams: b.protocolParams? JSON.parse(b.protocolParams): null, restBetweenItems: b.restBetweenItems||null } });
        for (const it of b.items){
          const nit = await prisma.planBlockItem.create({ data: { blockId: nb.id, order: it.order, exerciseId: it.exerciseId, note: it.note } });
          for (const s of it.sets){
            await prisma.planSet.create({ data: { itemId: nit.id, order: s.order||0, reps: s.reps||null, weight: s.weight||null, rest: s.rest||null, tempo: s.tempo||null, rpe: s.rpe||null, durationSec: s.durationSec||null } });
          }
        }
      }
    }
    return await this.plan(clone.id) as any;
  }

  

  @Query(() => [ValidationIssueDTO])
  async validatePlan(@Args('planId') planId:string): Promise<ValidationIssueDTO[]> {
    const issues:ValidationIssueDTO[] = [];
    const plan:any = await prisma.plan.findUnique({ where:{ id: planId }, include:{ days:{ include:{ blocks:{ include:{ items:true } } } } } });
    if (!plan){ issues.push({ level:'error', message:'Plan not found' } as any); return issues; }
    for (const d of plan.days){
      for (const b of d.blocks){
        const t = (b.type||'SINGLE').toUpperCase();
        if (t==='SUPERSET' && (b.items||[]).length<2) issues.push({ level:'warn', message:'Superset needs ≥2 items', blockId:b.id } as any);
        if (t==='TRISET' && (b.items||[]).length<3) issues.push({ level:'warn', message:'Triset needs ≥3 items', blockId:b.id } as any);
        if (t==='CIRCUIT'){
          if ((b.items||[]).length<3) issues.push({ level:'warn', message:'Circuit recommended ≥3 items', blockId:b.id } as any);
          if (!b.rounds) issues.push({ level:'warn', message:'Circuit requires rounds', blockId:b.id } as any);
        }
        if (b.protocol==='EMOM' && !(b.protocolParams?.minutes)) issues.push({ level:'warn', message:'EMOM requires minutes', blockId:b.id } as any);
        if (b.protocol==='HIIT' && !(b.protocolParams?.rounds)) issues.push({ level:'warn', message:'HIIT requires rounds/work/rest', blockId:b.id } as any);
      }
    }
    return issues;
  }

  @Query(() => SessionDetailDTO, { nullable:true })
  async sessionDetail(@Args('id') id:string): Promise<SessionDetailDTO|null> {
    const s:any = await prisma.planSession.findUnique({ where:{ id }, include:{ assignment:true } });
    if (!s) return null;
    const plan:any = await prisma.plan.findUnique({ where:{ id: s.assignment.planId }, include:{ days: { include: { blocks: { include: { items: { include: { sets: true, exercise:true } } } } } } } });
    const day = plan?.days?.[s.dayIndex]; if (!day) return null;
    return { id: s.id, date: s.date, status: s.status, completedAt: s.completedAt, dayIndex: s.dayIndex, blocks: day.blocks } as any;
  }


  @Mutation(() => Boolean)
  async generatePlanSchedule(@Args('assignmentId') assignmentId:string, @Args('startDate') startDate:string, @Args('sessionsPerWeek') sessionsPerWeek:number, @Args('restDays', {nullable:true}) restDays?:string): Promise<boolean> {
    const asg:any = await prisma.planAssignment.findUnique({ where:{ id: assignmentId } });
    if (!asg) throw new Error('assignment not found');
    const plan:any = await prisma.plan.findUnique({ where:{ id: asg.planId }, include:{ days:true } });
    if (!plan || !plan.days?.length) throw new Error('plan has no days');
    const start = new Date(startDate);
    const rest = restDays ? JSON.parse(restDays) : [0]; // default Sunday
    // Clear existing future sessions for this assignment (optional)
    await prisma.planSession.deleteMany({ where:{ assignmentId, date: { gte: start } } });
    let created = 0;
    let dayIdx = 0;
    const end = new Date(start); end.setDate(end.getDate()+28); // ~4 هفته
    for (let d=new Date(start); d<=end; d.setDate(d.getDate()+1)){
      const weekday = d.getDay(); // 0..6
      if (rest.includes(weekday)) continue;
      // limit sessions per week
      // For simplicity, pick first N non-rest days each week
      const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6);
      const cnt = await prisma.planSession.count({ where:{ assignmentId, date:{ gte: weekStart, lte: weekEnd } } });
      if (cnt >= sessionsPerWeek) continue;
      await prisma.planSession.create({ data:{ assignmentId, dayIndex: dayIdx % plan.days.length, date: new Date(d), status: 'SCHEDULED' } });
      dayIdx++; created++;
    }
    return true;
  }


  @Query(() => AdherenceDTO)
  async userAdherence(@Args('clientId') clientId:string, @Args('from') from:string, @Args('to') to:string): Promise<AdherenceDTO> {
    const f = new Date(from); const t = new Date(to);
    const scheduled = await prisma.planSession.count({ where:{ clientId, date:{ gte: f, lte: t } } as any });
    const completed = await prisma.planSession.count({ where:{ clientId, status:'COMPLETED', date:{ gte: f, lte: t } } as any });
    const rate = scheduled? completed/scheduled : 0;
    return { clientId, scheduled, completed, completionRate: Number(rate.toFixed(3)) } as any;
  }

  // ---------- Assign & schedule ----------
  @ObjectType() class SessionDTO { @Field() id:string; @Field() date:Date; @Field() dayIndex:number; @Field() status:string; @Field({nullable:true}) completedAt?:Date; }
  @Query(() => [SessionDTO])
  async sessionsByClient(@Args('clientId') clientId:string, @Args('from') fro:string, @Args('to') to:string): Promise<SessionDTO[]> {
    const list = await prisma.planSession.findMany({ where: { assignment: { clientId }, date: { gte: new Date(fro), lte: new Date(to) } }, orderBy:{ date:'asc' } });
    return list as any;
  }

  @Mutation(() => AssignmentDTO)
  async reassignPlanDates(@Args('assignmentId') assignmentId:string, @Args('startDate') startDate:string, @Args('sessionsPerWeek') sessionsPerWeek:number, @Args('restDays', { type: () => [String] }) restDays:string[], @Args('durationDays') durationDays:number): Promise<AssignmentDTO> {
    const asg = await prisma.planAssignment.update({ where: { id: assignmentId }, data: { startDate: new Date(startDate), sessionsPerWeek, restDays, durationDays } });
    await prisma.planSession.deleteMany({ where: { assignmentId } });
    const plan = await prisma.plan.findUnique({ where: { id: asg.planId }, include: { days: true } });
    let cur = new Date(startDate);
    const end = new Date(new Date(startDate).getTime() + durationDays*86400000);
    let idx = 0; let weekKey = ''; let createdThisWeek = 0;
    while (cur <= end){
      const y = cur.getUTCFullYear();
      const firstDay = new Date(Date.UTC(y,0,1));
      const week = Math.ceil((((cur as any) - (firstDay as any)) / 86400000 + firstDay.getUTCDay()+1) / 7);
      const k = `${y}-W${week}`;
      if (k !== weekKey){ weekKey = k; createdThisWeek = 0; }
      const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][cur.getUTCDay()];
      if (!restDays.includes(dayName) && createdThisWeek < sessionsPerWeek){
        const dayIndex = idx % (plan?.days.length||1);
        await prisma.planSession.create({ data: { assignmentId, date: new Date(cur), dayIndex } });
        idx++; createdThisWeek++;
      }
      cur = new Date(cur.getTime() + 86400000);
    }
    return asg as any;
  }

  @ObjectType() class AssignmentDTO { @Field() id: string; @Field() planId: string; @Field() clientId: string; @Field() startDate: Date; @Field() sessionsPerWeek: number; @Field(() => [String]) restDays: string[]; @Field() durationDays: number; }
  @Mutation(() => AssignmentDTO)
  async assignPlan(
    @Args('planId') planId: string,
    @Args('clientId') clientId: string,
    @Args('startDate') startDate: string,
    @Args('sessionsPerWeek') sessionsPerWeek: number,
    @Args('restDays', { type: () => [String] }) restDays: string[],
    @Args('durationDays') durationDays: number,
  ): Promise<AssignmentDTO> {
    const assign = await prisma.planAssignment.create({ data: { planId, clientId, startDate: new Date(startDate), sessionsPerWeek, restDays, durationDays } });
    // Generate sessions: simple sequential mapping dayIndex → next training day skipping restDays
    const plan = await prisma.plan.findUnique({ where: { id: planId }, include: { days: true } });
    let cur = new Date(startDate);
    const end = new Date(new Date(startDate).getTime() + durationDays*86400000);
    let idx = 0; let weekKey = '' ; let createdThisWeek = 0;
    while (cur <= end){
      const y = cur.getUTCFullYear();
      const firstDay = new Date(Date.UTC(y,0,1));
      const week = Math.ceil((((cur as any) - (firstDay as any)) / 86400000 + firstDay.getUTCDay()+1) / 7);
      const k = `${y}-W${week}`;
      if (k !== weekKey){ weekKey = k; createdThisWeek = 0; }
      const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][cur.getUTCDay()];
      if (!restDays.includes(dayName) && createdThisWeek < sessionsPerWeek){
        const dayIndex = idx % (plan?.days.length||1);
        await prisma.planSession.create({ data: { assignmentId: assign.id, date: new Date(cur), dayIndex } });
        idx++; createdThisWeek++;
      }
      cur = new Date(cur.getTime() + 86400000);
    }
    return assign as any;
  }
}


function validateProtocolParams(proto?:string, params?:any){
  if (!proto) return;
  const p = params || {};
  const U = String(proto||'').toUpperCase();
  if (U==='5X5'){ /* no-op */ }
  else if (U==='GVT'){ if (typeof p.sets!=='number' || p.sets<=0) throw new Error('GVT requires numeric sets'); }
  else if (U==='EMOM'){ if (typeof p.minutes!=='number' || p.minutes<=0) throw new Error('EMOM requires minutes'); p.every = p.every||60; }
  else if (U==='HIIT'){ if (typeof p.work!=='number' || typeof p.rest!=='number') throw new Error('HIIT requires work/rest seconds'); }
}


function mustAny(ctx:any, roles:('admin'|'coach'|'user'|'specialist')[]){
  if (process.env.SKIP_AUTH==='1') return;
  const r = ctxRole(ctx); if (r==='admin') return;
  if (!roles.includes(r as any)) throw new Error('forbidden');
}
