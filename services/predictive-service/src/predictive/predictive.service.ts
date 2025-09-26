import { Injectable } from '@nestjs/common';

/**
 * Service implementing simple predictive logic for motivation drop and
 * injury risk. In a real-world scenario, these predictions would be
 * derived from machine learning models using historical data.
 */
@Injectable()
export class PredictiveService {
  /**
   * Predict the probability of a user experiencing a drop in motivation.
   * This dummy implementation uses a simple heuristic based on the
   * userId to illustrate variability.
   */
  async predictMotivationDrop(userId: number): Promise<number> {
    // Returns a value between 0 and 1
    return (userId % 10) / 10;
  }

  /**
   * Predict the risk of injury for a user. Also a dummy implementation
   * using a simple heuristic based on the userId.
   */
  async predictInjuryRisk(userId: number): Promise<number> {
    return ((userId + 5) % 10) / 10;
  }
}