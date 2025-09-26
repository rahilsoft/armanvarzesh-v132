import { Injectable } from '@nestjs/common';

class CircuitBreaker {
  private failures = 0;
  private openedAt = 0;
  constructor(private threshold = 5, private coolDownMs = 10_000) {}
  canPass() {
    if (this.failures < this.threshold) return true;
    return (Date.now() - this.openedAt) > this.coolDownMs;
  }
  onSuccess(){ this.failures = 0; }
  onFailure(){
    this.failures++;
    if (this.failures >= this.threshold) this.openedAt = Date.now();
  }
}

@Injectable()
export class PoseEstimatorService {
  private breaker = new CircuitBreaker(5, 10_000);

  async estimatePose(videoUrl: string, timeoutMs = 5000) {
    if (!this.breaker.canPass()) {
      throw new Error('PoseEstimator temporarily unavailable');
    }
    try {
      await new Promise(r => setTimeout(r, Math.min(timeoutMs, 500)));
      this.breaker.onSuccess();
      return { ok: true, videoUrl, keypoints: [] };
    } catch (e) {
      this.breaker.onFailure();
      throw e;
    }
  }
}
