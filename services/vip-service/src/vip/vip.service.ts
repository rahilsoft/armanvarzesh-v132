import { Injectable } from '@nestjs/common';

export interface VipUser {
  id: number;
  userId: number;
  level: string;
  joinedAt: Date;
}

/**
 * VipService manages VIP club membership for users. Data is stored in memory.
 */
@Injectable()
export class VipService {
  private vipUsers: VipUser[] = [];
  private idCounter = 1;

  upgradeUser(userId: number, level: string): VipUser {
    const existing = this.vipUsers.find(v => v.userId === userId);
    if (existing) {
      existing.level = level;
      return existing;
    }
    const vip: VipUser = {
      id: this.idCounter++,
      userId,
      level,
      joinedAt: new Date(),
    };
    this.vipUsers.push(vip);
    return vip;
  }

  listVipUsers(): VipUser[] {
    return this.vipUsers;
  }
}