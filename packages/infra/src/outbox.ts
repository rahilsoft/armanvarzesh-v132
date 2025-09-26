export type OutboxEvent = {
  aggregate: string;
  aggregateId: string;
  type: string;
  payload: any;
};

export type OutboxRepo = {
  // placeholder interface for compile-time
  save?: (event: OutboxEvent) => Promise<void>;
};

export class OutboxService {
  async emit(evt: OutboxEvent): Promise<void> {
    // no-op implementation for build/run
    return;
  }
}
