import { Injectable } from '@nestjs/common';

export interface Challenge {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: number;
}

export interface ChallengeEntry {
  id: number;
  challengeId: number;
  userId: number;
  points: number;
  joinedAt: Date;
}

/**
 * ChallengesService maintains in-memory lists of challenges and entries.
 * It provides CRUD operations to create challenges, join users to
 * challenges, add points to participants and retrieve leaderboards.
 */
@Injectable()
export class ChallengesService {
  private challenges: Challenge[] = [];
  private entries: ChallengeEntry[] = [];
  private challengeIdCounter = 1;
  private entryIdCounter = 1;

  createChallenge(name: string, description: string, startDate: Date, endDate: Date, createdBy: number): Challenge {
    const challenge: Challenge = {
      id: this.challengeIdCounter++,
      name,
      description,
      startDate,
      endDate,
      createdBy,
    };
    this.challenges.push(challenge);
    return challenge;
  }

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  joinChallenge(challengeId: number, userId: number): ChallengeEntry {
    // Ensure the challenge exists
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    // Check if user already joined
    const existing = this.entries.find(e => e.challengeId === challengeId && e.userId === userId);
    if (existing) {
      return existing;
    }
    const entry: ChallengeEntry = {
      id: this.entryIdCounter++,
      challengeId,
      userId,
      points: 0,
      joinedAt: new Date(),
    };
    this.entries.push(entry);
    return entry;
  }

  addPoints(entryId: number, points: number): ChallengeEntry {
    const entry = this.entries.find(e => e.id === entryId);
    if (!entry) {
      throw new Error('Challenge entry not found');
    }
    entry.points += points;
    return entry;
  }

  getLeaderboard(challengeId: number): ChallengeEntry[] {
    return this.entries
      .filter(e => e.challengeId === challengeId)
      .sort((a, b) => b.points - a.points);
  }
}