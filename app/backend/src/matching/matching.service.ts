import { Injectable } from '@nestjs/common';
import { CoachesService } from '../coaches/coaches.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Coach } from '../coaches/entities/coach.entity';

/**
 * MatchingService encapsulates the logic for selecting a limited set of
 * experts to present to a user during onboarding.  The algorithm filters
 * by expertise and calculates a simple score based on tenure and a
 * random component.  It also supports a package mode which returns
 * exactly one expert from each major domain (trainer, nutrition,
 * physio).  Scores are not persisted and exist only within the scope
 * of a single request.
 */
@Injectable()
export class MatchingService {
  constructor(
    private readonly coachesService: CoachesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async recommend(expertise?: string, limit = 3): Promise<Coach[]> {
    const all = await this.coachesService.findAll();
    const expertiseFilter = expertise?.toLowerCase();
    if (expertiseFilter && ['package', 'full', 'complete', 'all'].includes(expertiseFilter)) {
      return this.recommendPackage();
    }
    const filtered = expertiseFilter
      ? all.filter(
          (c) => c.expertise && c.expertise.toLowerCase() === expertiseFilter,
        )
      : all;
    /*
     * Compute a composite score for each coach.  The score draws on
     * several dimensions described in the business specification.
     * Because our current dataset lacks explicit metrics for follow‑up
     * rates, multi‑modal chat usage, survey feedback, renewal and
     * conversion rates, we synthesise these as random values between
     * 0 and 1 and weight them according to perceived importance.  The
     * coach’s tenure in days provides a modest base component.  A
     * tiny random number is appended to ensure distinct ordering.
     */
    const weights = {
      followUp: 0.15,
      multiModalChat: 0.1,
      biweeklySurvey: 0.1,
      endSurvey: 0.1,
      renewal: 0.2,
      goalOrientation: 0.1,
      conversion: 0.05,
      contentQuality: 0.1,
      tenure: 0.1,
    };
    const scored = await Promise.all(
      filtered.map(async (coach) => {
      const createdAt = coach.createdAt instanceof Date ? coach.createdAt.getTime() : 0;
      const tenureDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
      const rand = () => Math.random();
        // Compute average rating for the coach from the reviews service
        let avgRating = 0;
        try {
          const reviews = this.reviewsService.findByExpert(Number(coach.id));
          if (reviews && reviews.length > 0) {
            avgRating =
              reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              (reviews.length * 5);
          }
        } catch {}
      const score =
        rand() * weights.followUp +
        rand() * weights.multiModalChat +
        rand() * weights.biweeklySurvey +
        rand() * weights.endSurvey +
        rand() * weights.renewal +
        rand() * weights.goalOrientation +
        rand() * weights.conversion +
        rand() * weights.contentQuality +
        tenureDays * weights.tenure +
          avgRating * 0.2 +
          Math.random() * 0.05;
        return { coach, score };
      }),
    );
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((entry) => entry.coach);
  }

  async recommendPackage(): Promise<Coach[]> {
    const domains = ['trainer', 'nutrition', 'physio'];
    const results: Coach[] = [];
    for (const domain of domains) {
      const [coach] = await this.recommend(domain, 1);
      if (coach) results.push(coach);
    }
    return results;
  }
}