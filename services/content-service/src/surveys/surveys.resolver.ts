
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveysService } from './surveys.service';
import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role'] || 'guest'; }catch(e){ return 'guest'; } }

@Resolver()
export class SurveysResolver {
  constructor(private readonly svc: SurveysService){}

  @Mutation(()=> Boolean)
  async createSurveyTemplate(@Args('code') code:string, @Args('title') title:string, @Args('serviceType',{nullable:true}) serviceType?:ServiceType, @Args('periodDays',{nullable:true}) periodDays?:number, @Context() ctx:any){
    const role = ctxRole(ctx); if (role!=='admin') throw new Error('forbidden');
    await this.svc.createTemplate(code, title, serviceType, periodDays||undefined);
    return true;
  }

  @Mutation(()=> Boolean)
  async scheduleLeadBiweekly(@Args('leadId') leadId:string, @Context() ctx:any){
    const role = ctxRole(ctx); if (role!=='admin') throw new Error('forbidden');
    return this.svc.scheduleBiweeklyForLead(leadId);
  }

  @Mutation(()=> Boolean)
  async submitSurveyTask(@Args('taskId') taskId:string, @Args('rating') rating:number, @Args('comment',{nullable:true}) comment?:string, @Context() ctx:any){
    const uid = ctxUser(ctx); if (!uid) throw new Error('unauthenticated');
    return this.svc.submitTask(taskId, rating, comment);
  }

  @Query(()=> String)
  async mySurveyTasks(@Context() ctx:any){
    const uid = ctxUser(ctx); if (!uid) throw new Error('unauthenticated');
    const rows = await this.svc.listUserTasks(uid);
    return JSON.stringify(rows);
  }

  @Mutation(()=> Boolean)
  async cronDailySurveys(@Context() ctx:any){
    const role = ctxRole(ctx); if (role!=='admin') throw new Error('forbidden');
    return this.svc.generateDueTasksDaily();
  }
}
