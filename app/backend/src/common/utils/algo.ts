export function indexBy<T extends Record<string, any>>(items: T[], key: keyof T): Record<string, T> {
  return items.reduce((acc, item) => { const k = String(item[key]); acc[k] = item; return acc; }, {} as Record<string, T>);
}
export function uniqueBy<T, K>(items: T[], by: (t: T) => K): T[] {
  const seen = new Set<K>(); const out: T[] = [];
  for (const it of items) { const k = by(it); if (!seen.has(k)) { seen.add(k); out.push(it); } }
  return out;
}
