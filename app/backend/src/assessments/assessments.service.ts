import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Assessment, AssessmentAttempt, Prisma } from '@prisma/client';

/**
 * Assessments with a JSON-driven scoring rule engine — folded from
 * services/assessments-service (String ids -> Int PKs; injected PrismaService
 * replaces its private `new PrismaClient()`). Behaviour-preserving port; the
 * scoring engine's `any`s are replaced with a typed rule shape.
 */

export interface Answer { questionId: number; value: unknown }
export interface AttemptInput { userId: number; assessmentId: number; answers: Answer[] }

/** Per-question scoring rule: weight × (map lookup | clipped range | boolean). */
export interface ScoringRule {
  weight?: number;
  map?: Record<string, number>;
  range?: { min?: number; max?: number; mult?: number };
}

export interface Recommendation {
  plan: 'beginner' | 'intermediate' | 'advanced';
  delta: { volume: number; intensity: number };
}

@Injectable()
export class AssessmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const items = await this.prisma.assessment.findMany({
      include: { sections: { include: { questions: true }, orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return { items };
  }

  async getAssessment(assessmentId: number) {
    const a = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { sections: { include: { questions: true }, orderBy: { order: 'asc' } } },
    });
    if (!a) throw new BadRequestException('NOT_FOUND');
    return a;
  }

  /** User's attempt history (the original's placeholder now does what its name says). */
  async myAttempts(userId: number): Promise<{ items: AssessmentAttempt[] }> {
    return { items: await this.prisma.assessmentAttempt.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }) };
  }

  private scoreQuestion(scoring: ScoringRule | null, value: unknown): number {
    if (!scoring) return 0;
    const w = Number(scoring.weight ?? 1);
    if (scoring.map && value !== undefined && value !== null) {
      return Math.round(Number(scoring.map[String(value)] ?? 0) * w);
    }
    if (scoring.range && typeof value === 'number') {
      const { min = 0, max = 100, mult = 1 } = scoring.range;
      const clipped = Math.max(min, Math.min(max, value));
      return Math.round((clipped - min) * mult * w);
    }
    if (typeof value === 'boolean') return (value ? 1 : 0) * w;
    return 0;
  }

  private buildRecommendation(total: number): Recommendation {
    if (total >= 80) return { plan: 'advanced', delta: { volume: +10, intensity: +10 } };
    if (total >= 50) return { plan: 'intermediate', delta: { volume: +5, intensity: +5 } };
    return { plan: 'beginner', delta: { volume: -10, intensity: -10 } };
  }

  async submitAssessment(input: AttemptInput): Promise<{ attemptId: number; score: number; recommendation: Recommendation }> {
    const a = await this.prisma.assessment.findUnique({
      where: { id: input.assessmentId },
      include: { sections: { include: { questions: true } } },
    });
    if (!a) throw new BadRequestException('NOT_FOUND');

    const qIndex = new Map<number, { scoring: ScoringRule | null }>();
    for (const s of a.sections) for (const q of s.questions) qIndex.set(q.id, { scoring: q.scoring as ScoringRule | null });
    for (const ans of input.answers) {
      if (!qIndex.has(ans.questionId)) throw new BadRequestException('BAD_QUESTION');
    }

    let total = 0;
    for (const ans of input.answers) {
      total += this.scoreQuestion(qIndex.get(ans.questionId)!.scoring, ans.value);
    }
    const score = Math.max(0, Math.min(100, total));
    const recommendation = this.buildRecommendation(score);

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        userId: input.userId,
        assessmentId: input.assessmentId,
        answers: input.answers as unknown as Prisma.InputJsonValue,
        score,
        recommendation: recommendation as unknown as Prisma.InputJsonValue,
      },
    });
    return { attemptId: attempt.id, score, recommendation };
  }

  async assessmentResult(attemptId: number): Promise<AssessmentAttempt> {
    const attempt = await this.prisma.assessmentAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new BadRequestException('NOT_FOUND');
    return attempt;
  }

  /** Seed an assessment with sections/questions (admin/bootstrap path). */
  async seed(input: { code: string; name: string; domain: string; level?: string; durationMin?: number; sections: { title: string; order?: number; questions: { type: string; text: string; options?: unknown; scoring?: ScoringRule }[] }[] }): Promise<Assessment> {
    return this.prisma.assessment.create({
      data: {
        code: input.code,
        name: input.name,
        domain: input.domain,
        level: input.level,
        durationMin: input.durationMin ?? 10,
        sections: {
          create: input.sections.map((s, i) => ({
            title: s.title,
            order: s.order ?? i,
            questions: {
              create: s.questions.map((q) => ({
                type: q.type,
                text: q.text,
                options: q.options as Prisma.InputJsonValue | undefined,
                scoring: q.scoring as unknown as Prisma.InputJsonValue | undefined,
              })),
            },
          })),
        },
      },
    });
  }
}
