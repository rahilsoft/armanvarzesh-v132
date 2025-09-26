export async function mapWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T, index: number)=>Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  async function run() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx], idx);
    }
  }
  const runners = Array.from({ length: Math.max(1, limit) }, run);
  await Promise.all(runners.map(r => r()));
  return results;
}
