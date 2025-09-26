export type BackoffOptions = { retries?: number; baseMs?: number; maxMs?: number; jitter?: boolean };
export async function withBackoff<T>(fn: () => Promise<T>, opts: BackoffOptions = {}): Promise<T> {
  const retries = opts.retries ?? 3;
  const base = opts.baseMs ?? 200;
  const max = opts.maxMs ?? 2000;
  const jitter = opts.jitter ?? true;
  let attempt = 0;
  while (true) {
    try { return await fn(); }
    catch (e) {
      if (attempt >= retries) throw e;
      const exp = Math.min(max, base * Math.pow(2, attempt));
      const delay = jitter ? Math.round(exp * (0.5 + Math.random())) : exp;
      await new Promise(r => setTimeout(r, delay));
      attempt++;
    }
  }
}

export type BreakerState = 'CLOSED'|'OPEN'|'HALF_OPEN';
export class CircuitBreaker {
  private state: BreakerState = 'CLOSED';
  private failures = 0;
  constructor(
    private threshold = 5,
    private coolDownMs = 5000,
  ) {}
  private openUntil = 0;

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now >= this.openUntil) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('CIRCUIT_OPEN');
      }
    }
    try {
      const res = await fn();
      this.onSuccess();
      return res;
    } catch (e) {
      this.onFailure();
      throw e;
    }
  }

  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failures = 0;
    } else if (this.state === 'CLOSED') {
      this.failures = 0;
    }
  }
  private onFailure() {
    this.failures++;
    if (this.state === 'HALF_OPEN' || (this.state === 'CLOSED' && this.failures >= this.threshold)) {
      this.state = 'OPEN';
      this.openUntil = Date.now() + this.coolDownMs;
    }
  }

  getState(): BreakerState { return this.state; }
}
