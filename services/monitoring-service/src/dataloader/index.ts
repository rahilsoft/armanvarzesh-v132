import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class LoaderRegistry {
  private loaders = new Map<string, any>();
  get<T>(key: string, factory: () => DataLoader<any, T>): DataLoader<any, T> {
    if (!this.loaders.has(key)) {
      this.loaders.set(key, factory());
    }
    return this.loaders.get(key);
  }
}
