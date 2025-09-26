
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { Queue } from 'bullmq';

const prisma = new PrismaClient();
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function mustAny(ctx:any, roles:string[]){ const r = ctx?.req?.headers?.['x-role']||'guest'; if (r==='admin') return; if (!roles.includes(r)) throw new Error('forbidden'); }

@Resolver()
export class MediaResolver {
  @Mutation(()=> String)
  async requestThumbnail(@Args('url') url:string, @Context() ctx:any): Promise<string>{
    mustAny(ctx, ['admin','coach','specialist']);
    const job = await prisma.mediaJob.create({ data:{ kind:'THUMBNAIL', url, status:'PENDING', createdBy: ctxUser(ctx)||undefined } });
    // NOTE: Processor implementation is environment-specific (FFmpeg). You can run an external worker to poll MediaJob.
    try { const q = new Queue('media', { connection: { url: process.env.BULLMQ_CONNECTION || process.env.REDIS_URL }, defaultJobOptions: { attempts: parseInt(process.env.BULLMQ_DEFAULT_ATTEMPTS||'5'), backoff: { type: 'exponential', delay: parseInt(process.env.BULLMQ_BACKOFF_MS||'5000') }, removeOnComplete: parseInt(process.env.BULLMQ_REMOVE_ON_COMPLETE||'1000'), removeOnFail: parseInt(process.env.BULLMQ_REMOVE_ON_FAIL||'5000') },  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } }); await q.add('thumbnail', { jobId: job.id }, { removeOnComplete: true }); } catch(e) {}
    return job.id;
  }

  @Mutation(()=> Boolean)
  async completeThumbnail(@Args('jobId') jobId:string, @Args('resultJson') resultJson:string, @Context() ctx:any): Promise<boolean>{
    mustAny(ctx, ['admin']);
    await prisma.mediaJob.update({ where:{ id: jobId }, data:{ status:'DONE', result: JSON.parse(resultJson||'{}') } });
    return true;
  }

  @Mutation(()=> Boolean)
  async failThumbnail(@Args('jobId') jobId:string, @Args('error') error:string, @Context() ctx:any): Promise<boolean>{
    mustAny(ctx, ['admin']);
    await prisma.mediaJob.update({ where:{ id: jobId }, data:{ status:'ERROR', error } });
    return true;
  }
}
