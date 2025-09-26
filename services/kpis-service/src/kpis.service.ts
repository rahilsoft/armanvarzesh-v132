
import { Injectable } from '@nestjs/common';

@Injectable()
export class KpisService {
  async coachKpis(coachId: number) {
    // In production, compute from DB; here, deterministic demo KPIs.
    const now = new Date();
    return {
      coachId,
      period: { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now },
      retention30d: 0.86,
      activeTrainees: 128,
      mrr: 7420.00,
      arpu: 58.0,
      sessionsBooked7d: 214,
      churnRate: 0.042
    };
  }
}
