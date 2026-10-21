import { Injectable } from '@nestjs/common';
import { CoachesService } from '../coaches/coaches.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Coach } from '../coaches/entities/coach.entity';

/**
 * Score = sum of weighted components, each normalised to 0..1:
 *  - goalMatch   : share of the user's goal keywords found in the coach's
 *                  expertise, speciality and bio (0 when no goals given)
 *  - rating      : Bayesian-smoothed average review rating, so a single
 *                  5-star review does not outrank a long strong record
 *  - experience  : tenure on the platform, saturating at two years
 *  - verified    : admin-verified coach
 *  - completeness: certifications and bio filled in
 */
export const MATCHING_WEIGHTS = {
  goalMatch: 0.35,
  rating: 0.3,
  experience: 0.15,
  verified: 0.15,
  completeness: 0.05,
} as const;

const PRIOR_RATING = 0.7; // 3.5 of 5
const PRIOR_WEIGHT = 3; // virtual reviews at the prior mean
const FULL_EXPERIENCE_DAYS = 730;
const DAY_MS = 24 * 60 * 60 * 1000;
export const MAX_GOALS = 10;
export const MAX_GOAL_LENGTH = 64;
export const MAX_LIMIT = 20;

/** Caps untrusted goal input: at most MAX_GOALS strings of MAX_GOAL_LENGTH chars. */
export function sanitizeGoals(goals: unknown): string[] {
  if (!Array.isArray(goals)) return [];
  return goals
    .filter((g): g is string => typeof g === 'string')
    .map((g) => g.trim().slice(0, MAX_GOAL_LENGTH))
    .filter(Boolean)
    .slice(0, MAX_GOALS);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1);
}

/**
 * MatchingService selects a limited set of experts to present to a user
 * during onboarding. Ranking is fully deterministic: the same coaches,
 * reviews, goals and clock always yield the same order, with ties broken
 * by ascending coach id. Package mode returns one expert from each major
 * domain (trainer, nutrition, physio). Scores are not persisted.
 *
 * The Coach model has no price, language or location columns yet, so those
 * dimensions are not scored; add them here when the schema gains them.
 */
@Injectable()
export class MatchingService {
  constructor(
    private readonly coachesService: CoachesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  /** Deterministic 0..1 score for one coach. */
  scoreCoach(coach: Coach, goals: string[], now: number): number {
    const goalTokens = Array.from(new Set(sanitizeGoals(goals).flatMap(tokenize)));
    let goalMatch = 0;
    if (goalTokens.length > 0) {
      const haystack = new Set(
        tokenize([coach.expertise, coach.speciality, coach.bio].filter(Boolean).join(' ')),
      );
      goalMatch = goalTokens.filter((t) => haystack.has(t)).length / goalTokens.length;
    }

    const reviews = this.reviewsService.findByExpert(Number(coach.id)) ?? [];
    const ratingSum = reviews.reduce((sum, r) => sum + (r.rating ?? 0) / 5, 0);
    const rating = (ratingSum + PRIOR_RATING * PRIOR_WEIGHT) / (reviews.length + PRIOR_WEIGHT);

    const createdAt = coach.createdAt instanceof Date ? coach.createdAt.getTime() : now;
    const tenureDays = Math.max(0, (now - createdAt) / DAY_MS);
    const experience = Math.min(tenureDays / FULL_EXPERIENCE_DAYS, 1);

    const completeness = (coach.certifications ? 0.5 : 0) + (coach.bio ? 0.5 : 0);

    const score =
      goalMatch * MATCHING_WEIGHTS.goalMatch +
      rating * MATCHING_WEIGHTS.rating +
      experience * MATCHING_WEIGHTS.experience +
      (coach.verified ? 1 : 0) * MATCHING_WEIGHTS.verified +
      completeness * MATCHING_WEIGHTS.completeness;
    return Math.round(score * 1e9) / 1e9;
  }

  async recommend(
    expertise?: string,
    limit = 3,
    goals: string[] = [],
    now: number = Date.now(),
  ): Promise<Coach[]> {
    goals = sanitizeGoals(goals);
    const all = await this.coachesService.findAll();
    const expertiseFilter = expertise?.toLowerCase();
    if (expertiseFilter && ['package', 'full', 'complete', 'all'].includes(expertiseFilter)) {
      return this.recommendPackage(goals, now);
    }
    const filtered = expertiseFilter
      ? all.filter((c) => c.expertise && c.expertise.toLowerCase() === expertiseFilter)
      : all;
    const scored = filtered.map((coach) => ({
      coach,
      score: this.scoreCoach(coach as Coach, goals, now),
    }));
    scored.sort((a, b) => b.score - a.score || Number(a.coach.id) - Number(b.coach.id));
    const n = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), MAX_LIMIT) : 3;
    return scored.slice(0, n).map((entry) => entry.coach as Coach);
  }

  async recommendPackage(goals: string[] = [], now: number = Date.now()): Promise<Coach[]> {
    const domains = ['trainer', 'nutrition', 'physio'];
    const results: Coach[] = [];
    for (const domain of domains) {
      const [coach] = await this.recommend(domain, 1, goals, now);
      if (coach) results.push(coach);
    }
    return results;
  }
}
