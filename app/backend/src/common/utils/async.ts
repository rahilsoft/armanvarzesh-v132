export async function allSettledOrThrow<T>(promises: Promise<T>[], label = 'parallel'): Promise<T[]> {
  const results = await Promise.allSettled(promises);
  const errors = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
  if (errors.length) { const msgs = errors.map((e) => String(e.reason?.message || e.reason)).join('; '); throw new Error(`One or more tasks in ${label} failed: ${msgs}`); }
  return (results.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<T>[]).map((r) => r.value);
}
