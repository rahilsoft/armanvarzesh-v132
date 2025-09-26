import { Injectable } from '@nestjs/common';
import { PoseEstimatorService } from '../ml/poseEstimator.service';

@Injectable()
export class AIFeedbackProcessor {
  constructor(private readonly poseEstimator: PoseEstimatorService) {}

  async analyzeVideo(videoUrl: string): Promise<{ score: number; issues: string[] }> {
    const result = await this.poseEstimator.evaluate(videoUrl);
    return {
      score: result.accuracy,
      issues: result.issues
    };
  }
}
