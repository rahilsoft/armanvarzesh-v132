
import { Injectable } from '@nestjs/common';

@Injectable()
export class AffiliateService {
  async me(userId: number) {
    return {
      userId,
      code: 'AV-' + (1000 + (userId%8999)),
      clicks: 1240,
      signups: 213,
      conversions: 97,
      revenue: 3512.75
    };
  }

  async leaderboard() {
    return {
      items: [
        { userId: 18, displayName: 'Coach A', revenue: 9120.50 },
        { userId: 44, displayName: 'Coach B', revenue: 8112.30 },
        { userId: 7,  displayName: 'Coach C', revenue: 7333.00 },
      ]
    };
  }
}
