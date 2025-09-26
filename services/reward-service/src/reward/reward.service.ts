import { Injectable } from '@nestjs/common';

export interface Reward {
  id: number;
  title: string;
  xp: number;
  createdAt: Date;
}

export interface UserReward {
  id: number;
  userId: number;
  rewardId: number;
  grantedAt: Date;
}

/**
 * RewardService manages reward definitions and user rewards in memory.
 */
@Injectable()
export class RewardService {
  private rewards: Reward[] = [];
  private userRewards: UserReward[] = [];
  private rewardIdCounter = 1;
  private userRewardIdCounter = 1;

  createReward(title: string, xp: number): Reward {
    const reward: Reward = {
      id: this.rewardIdCounter++,
      title,
      xp,
      createdAt: new Date(),
    };
    this.rewards.push(reward);
    return reward;
  }

  listRewards(): Reward[] {
    return this.rewards;
  }

  grantRewardToUser(rewardId: number, userId: number): UserReward {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) throw new Error('Reward not found');
    const userReward: UserReward = {
      id: this.userRewardIdCounter++,
      userId,
      rewardId,
      grantedAt: new Date(),
    };
    this.userRewards.push(userReward);
    return userReward;
  }

  userRewardsByUser(userId: number): UserReward[] {
    return this.userRewards.filter(ur => ur.userId === userId);
  }
}