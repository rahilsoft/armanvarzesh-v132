
import { Injectable } from '@nestjs/common';
import { PrismaClient, ServiceType } from '@prisma/client';

@Injectable()
export class SurveysService {
  private prisma = new PrismaClient();

  async createTemplate(code:string, title:string, serviceType?:ServiceType, periodDays?:number){
    return this.prisma.surveyTemplate.upsert({
      where:{ code },
      update:{ title, serviceType, periodDays: periodDays||null, active: true },
      create:{ code, title, serviceType, periodDays: periodDays||null, active: true }
    });
  }

  async scheduleBiweeklyForLead(leadId:string){
    const lead:any = await this.prisma.lead.findUnique({ where:{ id: leadId } });
    if (!lead) throw new Error('lead not found');
    const tmpl = await this.prisma.surveyTemplate.findFirst({ where:{ code:'BIWEEKLY', active:true } });
    if (!tmpl) throw new Error('BIWEEKLY template missing');
    const next = new Date(Date.now() + 1000*60*60*24*14);
    await this.prisma.surveyTask.create({ data:{
      userId: lead.userId, specialistId: lead.specialistId, serviceType: lead.serviceType, templateCode: 'BIWEEKLY', dueAt: next
    }});
    return true;
  }

  async scheduleEndOfTerm(userId:string, specialistId:string, serviceType:ServiceType, days:number=30){
    const tmpl = await this.prisma.surveyTemplate.findFirst({ where:{ code:'END_OF_TERM', active:true } });
    if (!tmpl) throw new Error('END_OF_TERM template missing');
    const due = new Date(Date.now() + 1000*60*60*24*days);
    await this.prisma.surveyTask.create({ data:{ userId, specialistId, serviceType, templateCode:'END_OF_TERM', dueAt: due } });
    return true;
  }

  async generateDueTasksDaily(){
    // Create biweekly tasks for open leads that don't have an upcoming task (rough implementation)
    const since = new Date(Date.now() - 1000*60*60*24*16);
    const leads = await this.prisma.lead.findMany({ where:{ createdAt:{ gte: since } } });
    for (const l of leads){
      const existing = await this.prisma.surveyTask.findFirst({ where:{ userId:l.userId, specialistId:l.specialistId, templateCode:'BIWEEKLY', completedAt: null } });
      if (!existing){
        await this.scheduleBiweeklyForLead(l.id);
      }
    }
    return true;
  }

  async listUserTasks(userId:string){
    return this.prisma.surveyTask.findMany({ where:{ userId, completedAt: null }, orderBy:{ dueAt: 'asc' } });
  }

  async submitTask(taskId:string, rating:number, comment?:string){
    const t:any = await this.prisma.surveyTask.findUnique({ where:{ id: taskId } });
    if (!t) throw new Error('task not found');
    await this.prisma.surveyResponse.create({ data:{
      templateCode: t.templateCode, userId: t.userId, specialistId: t.specialistId, rating, comment: comment||null
    } });
    await this.prisma.surveyTask.update({ where:{ id: taskId }, data:{ completedAt: new Date() } });
    return true;
  }
}
