import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type Answer = { questionId: string, value: any };
type AttemptInput = { userId: string, assessmentId: string, answers: Answer[] };

function uid(): string { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8); return v.toString(16);
});}

@Injectable()
export class AssessmentsService {
  private prisma = new PrismaClient();

  async list(){ 
    const items = await this.prisma.assessment.findMany({ include: { sections: { include: { questions: true } } }, orderBy: { createdAt: 'desc' } });
    return { items };
  }

  async myAssessments(userId: string, status?: string){
    // status placeholder for 'pending'|'completed' filters (extend with Attempt joins)
    const items = await this.prisma.assessment.findMany({ orderBy: { createdAt: 'desc' } });
    return { items };
  }

  async getAssessment(assessmentId: string){
    const a = await this.prisma.assessment.findUnique({ where: { id: assessmentId }, include: { sections: { include: { questions: true } } } });
    if (!a) throw new BadRequestException('NOT_FOUND');
    return a;
  }

  async startAssessment(assessmentId: string){
    // could register a draft attempt; for now return metadata
    return this.getAssessment(assessmentId);
  }

  // Simple rule engine: each question.scoring = { weight?:number, map?:{[value]:number}, range?:{min?:number,max?:number,mult?:number} }
  private scoreQuestion(scoring: any, value: any): number {
    if (!scoring) return 0;
    const w = Number(scoring.weight ?? 1);
    if (scoring.map && typeof value !== 'undefined' && value !== null){
      const m = scoring.map;
      const k = String(value);
      const base = Number(m[k] ?? 0);
      return Math.round(base * w);
    }
    if (scoring.range && typeof value === 'number'){
      const { min=0, max=100, mult=1 } = scoring.range;
      const clipped = Math.max(min, Math.min(max, value));
      return Math.round((clipped - min) * mult * w);
    }
    if (typeof value === 'boolean'){
      return (value ? 1 : 0) * w;
    }
    return 0;
  }

  private buildRecommendation(domain:string, total:number){
    // naive thresholds; can be replaced with JSON-driven templates later
    if (total >= 80) return { plan: 'advanced', delta: { volume:+10, intensity:+10 } };
    if (total >= 50) return { plan: 'intermediate', delta: { volume:+5, intensity:+5 } };
    return { plan: 'beginner', delta: { volume:-10, intensity:-10 } };
  }

  async submitAssessment(input: AttemptInput){
    const a = await this.prisma.assessment.findUnique({ where: { id: input.assessmentId }, include: { sections: { include: { questions: true } } } });
    if (!a) throw new BadRequestException('NOT_FOUND');
    // validate answer existence
    const qIndex = new Map<string, any>();
    for (const s of a.sections) for (const q of s.questions) qIndex.set(q.id, q);
    for (const ans of input.answers){ if (!qIndex.has(ans.questionId)) throw new BadRequestException('BAD_QUESTION'); }

    // score
    let total = 0;
    for (const ans of input.answers){
      const q = qIndex.get(ans.questionId);
      total += this.scoreQuestion(q.scoring, ans.value);
    }
    const score = Math.max(0, Math.min(100, total)); // clamp to 0..100 for simplicity
    const recommendation = this.buildRecommendation(a.domain, score);

    const attempt = await this.prisma.assessmentAttempt.create({
      data: { id: uid(), userId: input.userId, assessmentId: input.assessmentId, answers: input.answers as any, score, recommendation: recommendation as any }
    });
    return { attemptId: attempt.id, score, recommendation };
  }

  async assessmentResult(attemptId: string){
    const attempt = await this.prisma.assessmentAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new BadRequestException('NOT_FOUND');
    return attempt;
  }
}
