import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SpecialistScore, SpecialistType, Prisma } from '@prisma/client';

/**
 * Specialist quality scoring — weighted composite per specialist+role with
 * persisted history and per-role configurable weights. Folded from
 * services/content-service (dismemberment step 4).
 *
 * The metric FORMULAS are ported verbatim below (normalisations, ratios,
 * newcomer baseline boost, weighted total). Raw activity counts, however,
 * come from sources owned by other bounded contexts (chat messages → Chat
 * extension service; leads/conversions/survey responses → CMS/CRM step 5;
 * corrective videos → Physio corrective step 6). Per the boundary contract
 * (ADR-B9) those are supplied through the injectable
 * {@link SpecialistMetricSources} instead of raw cross-context queries; the
 * default implementation reads what the canonical schema owns today and
 * reports zeros for not-yet-folded sources.
 */

export interface Weights {
  followup: number;
  multimodal: number;
  biweekly: number;
  endterm: number;
  renewal: number;
  goalFocus: number;
  freeToPremium: number;
  contentQuality: number;
  responsiveness: number;
  baselineBoost: number;
}

export const DEFAULT_WEIGHTS: Weights = {
  followup: 0.18, multimodal: 0.08, biweekly: 0.14, endterm: 0.18,
  renewal: 0.14, goalFocus: 0.08, freeToPremium: 0.12, contentQuality: 0.06,
  responsiveness: 0.02, baselineBoost: 0.0,
};

/** Raw 90-day activity counts a metric source must provide. */
export interface RawActivity {
  messages90d: number;
  voiceMessages90d: number;
  biweeklyRatings: number[];   // 1..5 survey ratings
  endtermRatings: number[];    // 1..5 survey ratings
  renewals90d: number;
  uniqueClients90d: number;
  plans90d: number;
  plansWithGoal90d: number;
  freeToPremium90d: number;
  leads90d: number;
  approvedVideos: number;
  messages24h: number;
  messages7d: number;
  hasAnyClients: boolean;
}

/** Pluggable raw-count provider (cross-context sources arrive via later folds). */
export abstract class SpecialistMetricSources {
  abstract collect(specialistId: number, role: SpecialistType): Promise<RawActivity>;
}

@Injectable()
export class CanonicalMetricSources extends SpecialistMetricSources {
  constructor(private readonly prisma: PrismaService) { super(); }

  async collect(specialistId: number, _role: SpecialistType): Promise<RawActivity> {
    const since = new Date(Date.now() - 90 * 86_400_000);
    // Sources the canonical schema owns today: plans authored by the
    // specialist. Chat/CRM/survey/video counts arrive with their folds.
    const plans = await this.prisma.plan.findMany({ where: { createdBy: specialistId, createdAt: { gte: since } } });
    const plansWithGoal = plans.filter((p) => JSON.stringify(p.json ?? '').includes('goal')).length;
    return {
      messages90d: 0, voiceMessages90d: 0, biweeklyRatings: [], endtermRatings: [],
      renewals90d: 0, uniqueClients90d: 0,
      plans90d: plans.length, plansWithGoal90d: plansWithGoal,
      freeToPremium90d: 0, leads90d: 0, approvedVideos: 0,
      messages24h: 0, messages7d: 0, hasAnyClients: false,
    };
  }
}

/** Pure metric normalisation — ported verbatim from the original engine. */
export function computeMetrics(raw: RawActivity): Record<keyof Omit<Weights, 'baselineBoost'>, number> & { baselineBoost: number } {
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / (xs.length * 5) : 0);
  return {
    followup: Math.min(1, raw.messages90d / 200),
    multimodal: raw.messages90d ? Math.min(1, raw.voiceMessages90d / raw.messages90d) : 0,
    biweekly: avg(raw.biweeklyRatings),
    endterm: avg(raw.endtermRatings),
    renewal: raw.uniqueClients90d ? Math.min(1, raw.renewals90d / raw.uniqueClients90d) : 0,
    goalFocus: raw.plans90d ? raw.plansWithGoal90d / raw.plans90d : 0,
    freeToPremium: raw.leads90d ? Math.min(1, raw.freeToPremium90d / raw.leads90d) : 0,
    contentQuality: Math.min(1, raw.approvedVideos / 100),
    responsiveness: raw.messages7d ? Math.min(1, (raw.messages24h / raw.messages7d) * 3) : 0,
    baselineBoost: raw.hasAnyClients ? 0 : 0.25,
  };
}

export function weightedTotal(w: Weights, m: ReturnType<typeof computeMetrics>): number {
  return (
    w.followup * m.followup + w.multimodal * m.multimodal + w.biweekly * m.biweekly +
    w.endterm * m.endterm + w.renewal * m.renewal + w.goalFocus * m.goalFocus +
    w.freeToPremium * m.freeToPremium + w.contentQuality * m.contentQuality +
    w.responsiveness * m.responsiveness + (w.baselineBoost || 0) * m.baselineBoost
  );
}

@Injectable()
export class SpecialistScoringService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sources: SpecialistMetricSources,
  ) {}

  async getWeightsFor(role: SpecialistType): Promise<Weights> {
    const w = await this.prisma.scoringWeights.findUnique({ where: { role } });
    return (w?.weights as unknown as Weights) ?? DEFAULT_WEIGHTS;
  }

  async setWeightsFor(role: SpecialistType, weights: Weights): Promise<void> {
    await this.prisma.scoringWeights.upsert({
      where: { role },
      update: { weights: weights as unknown as Prisma.InputJsonValue },
      create: { role, weights: weights as unknown as Prisma.InputJsonValue },
    });
  }

  /** Compute, persist (upsert on specialist+role) and archive to history. */
  async computeFor(specialistId: number, role: SpecialistType): Promise<{ total: number; metrics: ReturnType<typeof computeMetrics> }> {
    const w = await this.getWeightsFor(role);
    const metrics = computeMetrics(await this.sources.collect(specialistId, role));
    const total = weightedTotal(w, metrics);
    await this.prisma.specialistScore.upsert({
      where: { specialistId_role: { specialistId, role } },
      update: { totalScore: total, metrics, lastComputed: new Date() },
      create: { specialistId, role, totalScore: total, metrics, lastComputed: new Date() },
    });
    await this.prisma.specialistScoreHistory.create({ data: { specialistId, role, totalScore: total, metrics } });
    return { total, metrics };
  }

  topByRole(role: SpecialistType, limit = 3): Promise<SpecialistScore[]> {
    return this.prisma.specialistScore.findMany({ where: { role }, orderBy: { totalScore: 'desc' }, take: limit });
  }

  /** Recompute all known specialist+role pairs. */
  async recomputeAll(): Promise<number> {
    const rows = await this.prisma.specialistScore.findMany({ select: { specialistId: true, role: true } });
    for (const r of rows) await this.computeFor(r.specialistId, r.role);
    return rows.length;
  }
}
