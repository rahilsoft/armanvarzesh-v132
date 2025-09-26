import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry = new Registry();
  liveTokens = new Counter({ name: 'live_tokens_issued_total', help: 'Live tokens issued', registers: [this.registry] });
  livePurchases = new Counter({ name: 'live_purchases_total', help: 'Live purchases succeeded', registers: [this.registry] });
  liveChats = new Counter({ name: 'live_chats_total', help: 'Live chat messages', registers: [this.registry] });
  liveReactions = new Counter({ name: 'live_reactions_total', help: 'Live reactions', registers: [this.registry] });
  liveJoins = new Counter({ name: 'live_joins_total', help: 'Live joins', registers: [this.registry] });
  liveLeaves = new Counter({ name: 'live_leaves_total', help: 'Live leaves', registers: [this.registry] });

  constructor(){
    collectDefaultMetrics({ register: this.registry });
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
}
