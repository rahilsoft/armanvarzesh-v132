import { Injectable, ConflictException } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Idempotency service with two modes:
 *  - Redis (default): set NX key and store JSON response for replay.
 *  - In-memory (when REDIS_URL=memory): for tests without Redis.
 */
@Injectable()
export class IdempotencyService {
  private redis?: Redis;
  private memory = new Map<string, { exp: number, value: any }>();
  private ttlSeconds = Number(process.env.IDEMPOTENCY_TTL || 600);
  private useMemory: boolean;

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379/0';
    this.useMemory = url.startsWith('memory');
    if (!this.useMemory) {
      this.redis = new Redis(url);
    }
  }

  private expiresAt(): number {
    return Math.floor(Date.now()/1000) + this.ttlSeconds;
  }

  async ensure(key: string): Promise<void> {
    if (!key) return;
    if (this.useMemory) {
      if (this.memory.has(key) && (this.memory.get(key)!.exp > Math.floor(Date.now()/1000))) {
        throw new ConflictException('Idempotency key already used');
      }
      // mark as used (without response)
      this.memory.set(key, { exp: this.expiresAt(), value: undefined });
      return;
    }
    const ok = await this.redis!.set(`idem:${key}:lock`, '1', 'EX', this.ttlSeconds, 'NX');
    if (ok === null) throw new ConflictException('Idempotency key already used');
  }

  async ensureAndReplay<T>(key: string, compute: () => Promise<T>): Promise<T> {
    if (!key) return compute();

    if (this.useMemory) {
      const hit = this.memory.get(key);
      if (hit && hit.exp > Math.floor(Date.now()/1000) && typeof hit.value !== 'undefined') {
        return hit.value as T;
      }
      if (hit && hit.exp > Math.floor(Date.now()/1000) && typeof hit.value === 'undefined') {
        throw new ConflictException('Idempotency key already used');
      }
      // Reserve lock
      this.memory.set(key, { exp: this.expiresAt(), value: undefined });
      const val = await compute();
      this.memory.set(key, { exp: this.expiresAt(), value: val });
      return val;
    }

    // Redis mode
    const lockKey = `idem:${key}:lock`;
    const valKey = `idem:${key}:val`;
    // Try replay first
    const cached = await this.redis!.get(valKey);
    if (cached) return JSON.parse(cached) as T;

    const ok = await this.redis!.set(lockKey, '1', 'EX', this.ttlSeconds, 'NX');
    if (ok === null) {
      // Someone used this key; try replay
      const cached2 = await this.redis!.get(valKey);
      if (cached2) return JSON.parse(cached2) as T;
      throw new ConflictException('Idempotency key already used');
    }
    const result = await compute();
    await this.redis!.set(valKey, JSON.stringify(result), 'EX', this.ttlSeconds);
    return result;
  }
}
