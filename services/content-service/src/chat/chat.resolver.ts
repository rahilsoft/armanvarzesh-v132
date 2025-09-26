
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { wsBroadcast } from '../main';

const prisma = new PrismaClient();
function now(){ return new Date(); }
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role'] || 'guest'; }catch(e){ return 'guest'; } }
function must(ctx:any, roles:string[]){ if (process.env.SKIP_AUTH==='1') return; const r = ctxRole(ctx); if (!roles.includes(r) && r!=='admin') throw new Error('forbidden'); }

@Resolver()
export class ChatResolver {
  @Mutation(()=> String)
  async ensureThread(@Args('specialistId') specialistId:string, @Args('userId') userId:string, @Context() ctx:any): Promise<string>{
    must(ctx, ['specialist','user','coach']);
    const t = await prisma.chatThread.findFirst({ where:{ specialistId, userId } });
    if (t) return t.id;
    const created = await prisma.chatThread.create({ data:{ specialistId, userId } });
    return created.id;
  }

  @Mutation(()=> Boolean)
  async sendMessage(@Args('threadId') threadId:string, @Args('body',{nullable:true}) body?:string, @Args('voiceUrl',{nullable:true}) voiceUrl?:string, @Context() ctx:any): Promise<boolean>{
    const role = ctxRole(ctx); const uid = ctxUser(ctx) || 'anon';
    const msg = await prisma.chatMessage.create({ data:{ threadId, senderId: uid, senderRole: (role as any)||'user', body: body||null, voiceUrl: voiceUrl||null } });
    try{ wsBroadcast(threadId, msg); }catch(e){}
    return true;
  }

  @Query(()=> String)
  async listThreads(@Args('specialistId') specialistId:string, @Context() ctx:any): Promise<string>{
    must(ctx, ['specialist','admin']);
    const rows = await prisma.chatThread.findMany({ where:{ specialistId }, orderBy:{ createdAt:'desc' } });
    return JSON.stringify(rows);
  }

  @Query(()=> String)
  async messages(@Args('threadId') threadId:string, @Args('after',{nullable:true}) after?:string, @Context() ctx:any): Promise<string>{
    const where:any = { threadId };
    if (after) where.createdAt = { gt: new Date(after) };
    const rows = await prisma.chatMessage.findMany({ where, orderBy:{ createdAt:'asc' }, take: 200 });
    return JSON.stringify(rows);
  }
}
