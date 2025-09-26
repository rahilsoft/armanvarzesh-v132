
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient, ServiceType } from '@prisma/client';
import { ScoringService } from '../scoring/scoring.service';

const prisma = new PrismaClient();
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function must(ctx:any){ if (process.env.SKIP_AUTH==='1') return; if (!ctxUser(ctx)) throw new Error('unauthenticated'); }

@Resolver()
export class OnboardingResolver {
  constructor(private readonly scoring: ScoringService){}

  @Mutation(()=> Boolean)
  async saveUserOnboarding(@Args('profileJson') profileJson:string, @Context() ctx:any): Promise<boolean>{
    const uid = ctxUser(ctx) || 'anon';
    await prisma.userMeta.upsert({ where:{ userId: uid }, update:{ json: profileJson }, create:{ userId: uid, json: profileJson } } as any);
    return true;
  }

  @Mutation(()=> String)
  async ensureLead(@Args('specialistId') specialistId:string, @Args('serviceType') serviceType:ServiceType, @Context() ctx:any): Promise<string>{
    const uid = ctxUser(ctx) || 'anon';
    const lead = await prisma.lead.create({ data:{ userId: uid, specialistId, serviceType } });
    // ایجاد چت
    const t = await prisma.chatThread.findFirst({ where:{ specialistId, userId: uid } });
    if (!t){ await prisma.chatThread.create({ data:{ specialistId, userId: uid } }); }
    return lead.id;
  }

  @Query(()=> String)
  async recommendSpecialists(@Args('serviceType') serviceType:ServiceType, @Args('limit',{nullable:true}) limit?:number): Promise<string>{
    // recompute last-week active specialists quickly (demo-friendly)
    const list = await prisma.specialistScore.findMany({ where:{ role: serviceType }, orderBy:{ totalScore:'desc' }, take: limit||3 });
    return JSON.stringify(list);
  }
}
