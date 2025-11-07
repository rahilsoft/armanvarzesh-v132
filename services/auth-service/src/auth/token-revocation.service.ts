import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class TokenRevocationService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    await this.client.connect();
    console.log('[TokenRevocationService] Connected to Redis for token revocation');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  /**
   * Revoke a JWT access token by storing its JTI (JWT ID) in Redis.
   * The token is stored with a TTL equal to its remaining lifetime.
   * @param jti - The unique JWT ID from the token payload
   * @param expiresAt - The expiration timestamp of the token
   */
  async revokeToken(jti: string, expiresAt: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresAt - now;

    if (ttl > 0) {
      // Store the revoked token with TTL equal to remaining lifetime
      await this.client.setEx(`revoked:${jti}`, ttl, '1');
    }
  }

  /**
   * Check if a token has been revoked
   * @param jti - The unique JWT ID from the token payload
   * @returns true if the token has been revoked
   */
  async isTokenRevoked(jti: string): Promise<boolean> {
    const result = await this.client.get(`revoked:${jti}`);
    return result !== null;
  }

  /**
   * Revoke all tokens for a specific user by storing their user ID in Redis.
   * This is useful for logout from all devices or account compromise scenarios.
   * @param userId - The user ID
   * @param ttl - How long to maintain the revocation (in seconds, default 24 hours)
   */
  async revokeAllUserTokens(userId: string, ttl: number = 86400): Promise<void> {
    await this.client.setEx(`revoked:user:${userId}`, ttl, Date.now().toString());
  }

  /**
   * Check if all tokens for a user have been revoked
   * @param userId - The user ID
   * @param tokenIssuedAt - When the token was issued (iat from JWT payload)
   * @returns true if the token was issued before the revocation timestamp
   */
  async areUserTokensRevoked(userId: string, tokenIssuedAt: number): Promise<boolean> {
    const revokedAt = await this.client.get(`revoked:user:${userId}`);
    if (!revokedAt) return false;

    // If token was issued before the revocation timestamp, it's revoked
    return tokenIssuedAt < parseInt(revokedAt, 10);
  }
}
