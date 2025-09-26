// Phase J — Request-scoped DataLoader infra (generic)
import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';

type BatchFn<K, V> = (keys: readonly K[]) => Promise<(V | Error)[]>;

@Injectable({ scope: Scope.REQUEST })
export class LoaderFactory {
  // Example: createLoader for (key -> value) with stable ordering
  createLoader<K, V>(batchFn: BatchFn<K, V>) {
    return new DataLoader<K, V>(async (keys) => {
      const res = await batchFn(keys);
      return res;
    }, { cache: true });
  }
}
