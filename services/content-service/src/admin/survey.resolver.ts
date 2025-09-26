
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient, ServiceType } from '@prisma/client';
const prisma = new PrismaClient();
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role']||'guest'; }catch(e){ return 'guest'; } }
function mustAdmin(ctx:any){ if (process.env.SKIP_AUTH==='1') return; if (ctxRole(ctx)!=='admin') throw new Error('forbidden'); }

@Resolver()
export class SurveyAdminResolver {
  @Query(()=> String)
  async listSurveyTemplates(): Promise<string>{
    const rows = await prisma.surveyTemplate.findMany({ where:{ active:true }, orderBy:{ createdAt:'desc' } });
    return JSON.stringify(rows);
  }
  @Mutation(()=> Boolean)
  async upsertSurveyTemplate(@Args('code') code:string, @Args('title') title:string, @Args('periodDays',{nullable:true}) periodDays?:number, @Args('serviceType',{nullable:true}) serviceType?:ServiceType, @Context() ctx:any): Promise<boolean>{
    mustAdmin(ctx);
    await prisma.surveyTemplate.upsert({ where:{ code }, update:{ title, periodDays, serviceType }, create:{ code, title, periodDays, serviceType } });
    return true;
  }
  @Mutation(()=> Boolean)
  async deactivateSurveyTemplate(@Args('code') code:string, @Context() ctx:any): Promise<boolean>{
    mustAdmin(ctx);
    await prisma.surveyTemplate.update({ where:{ code }, data:{ active:false } });
    return true;
  }
}
