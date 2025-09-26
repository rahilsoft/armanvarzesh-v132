import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';

export type BatchFn<K, V> = (keys: readonly K[]) => PromiseLike<(V | Error)[]>;

@Injectable({ scope: Scope.REQUEST })
export class LoaderFactory {
  create<K, V>(batch: BatchFn<K, V>): DataLoader<K, V> {
    return new DataLoader<K, V>(async (keys) => {
      const results = await batch(keys);
      return results as (V | Error)[];
    }, { maxBatchSize: 100 });
  }
}
