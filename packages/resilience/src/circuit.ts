export class CircuitBreaker {
  private failures = 0;
  private openUntil = 0;
  constructor(private maxFailures = 5, private cooldownMs = 10_000) {}
  get isOpen() { return Date.now() < this.openUntil; }
  async exec<T>(fn: ()=>Promise<T>): Promise<T> {
    if (this.isOpen) throw new Error('circuit-open');
    try {
      const out = await fn();
      this.failures = 0;
      return out;
    } catch (e) {
      this.failures++;
      if (this.failures >= this.maxFailures) this.openUntil = Date.now() + this.cooldownMs;
      throw e;
    }
  }
}
