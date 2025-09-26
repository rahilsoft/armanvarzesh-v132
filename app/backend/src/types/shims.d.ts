// Minimal shims so backend compiles in CI without private packages

declare module '@arman/infra/src/outbox' {
  export interface OutboxEvent {
    id?: string;
    topic: string;
    payload: unknown;
    createdAt?: Date;
  }

  export interface OutboxRepo {
    store(event: OutboxEvent): Promise<void>;
    next?(limit?: number): Promise<OutboxEvent[]>;
    ack?(id: string): Promise<void>;
    retry?(id: string): Promise<void>;
  }

  export class OutboxService {
    constructor(repo?: OutboxRepo);
    emit(event: OutboxEvent): Promise<void>;
    pull?(limit?: number): Promise<OutboxEvent[]>;
    ack?(id: string): Promise<void>;
    retry?(id: string): Promise<void>;
  }
}

declare module '@arman/infra/src/idempotency' {
  export interface IdempotencyRepo {
    exists(key: string): Promise<boolean>;
    save(key: string): Promise<void>;
    // alias some code might use
    has?(key: string): Promise<boolean>;
  }

  export class IdempotencyService {
    constructor(repo?: IdempotencyRepo);
    runOnce<T>(key: string, _scope: string, fn: () => Promise<T>): Promise<T>;
  }
}

declare module '@arman/graphql-utils/src/dataloader' {
  export function makeLoader<T = any, K = string>(
    batchFn: (keys: readonly K[]) => Promise<(T | Error)[]>,
  ): {
    load: (key: K) => Promise<T>;
    loadMany: (keys: readonly K[]) => Promise<(T | Error)[]>;
    clear?: (key: K) => void;
    clearAll?: () => void;
    prime?: (key: K, value: T) => void;
  };
}
