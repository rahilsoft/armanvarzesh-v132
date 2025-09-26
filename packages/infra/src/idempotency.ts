export class IdempotencyRepo {
  private set = new Set<string>();
  async has(key: string): Promise<boolean> { return this.set.has(key); }
  async put(key: string): Promise<void> { this.set.add(key); }
}

export class IdempotencyService {
  constructor(private repo: IdempotencyRepo = new IdempotencyRepo()) {}
  async runOnce<T>(key: string, _group: string, fn: () => Promise<T>): Promise<T> {
    if (await this.repo.has(key)) {
      // already executed; @todo return cached value if needed
      return undefined as unknown as T;
    }
    const res = await fn();
    await this.repo.put(key);
    return res;
  }
}
