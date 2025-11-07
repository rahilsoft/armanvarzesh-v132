import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Token Blacklist Service using Redis
 * Manages revoked JWT tokens with automatic TTL cleanup
 */
@Injectable()
export class TokenBlacklistService {
  private redis: Redis;
  private readonly PREFIX = 'blacklist:jti:';

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
  }

  /**
   * Add a token to the blacklist
   * @param jti JWT ID
   * @param ttl Time to live in seconds (should match JWT expiry)
   */
  async blacklist(jti: string, ttl: number): Promise<void> {
    const key = this.PREFIX + jti;
    await this.redis.setex(key, ttl, '1');
  }

  /**
   * Check if a token is blacklisted
   * @param jti JWT ID
   * @returns true if blacklisted
   */
  async isBlacklisted(jti: string): Promise<boolean> {
    const key = this.PREFIX + jti;
    const result = await this.redis.get(key);
    return result !== null;
  }

  /**
   * Remove from blacklist (rare use case)
   */
  async remove(jti: string): Promise<void> {
    const key = this.PREFIX + jti;
    await this.redis.del(key);
  }

  /**
   * Get blacklist stats
   */
  async getStats(): Promise<{ count: number }> {
    const keys = await this.redis.keys(this.PREFIX + '*');
    return { count: keys.length };
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
