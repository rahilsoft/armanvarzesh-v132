import DataLoader from 'dataloader';
export function makeLoader<T, V>(batch: (keys: readonly T[]) => Promise<(V | Error)[]>) {
  return new DataLoader<T, V>(batch as any);
}
