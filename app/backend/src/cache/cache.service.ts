import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

type Entry = { v: any; e: number };

@Injectable()
export class CacheService {
  private mem = new Map<string, Entry>();
  private redis?: Redis;
  private log = new Logger('CacheService');

  constructor(){
    const url = process.env.REDIS_URL || process.env.REDIS_TLS_URL;
    if (url){
      try {
        this.redis = new Redis(url, { tls: url.startsWith('rediss://') ? {} as any : undefined });
        this.redis.on('error', (e)=> this.log.warn('Redis error: '+e.message));
      } catch (e) { this.log.warn('Redis disabled: '+(e as any)?.message); }
    }
  }

  async get<T=any>(key: string): Promise<T | null> {
    if (this.redis){
      const v = await this.redis.get(key);
      return v ? JSON.parse(v) as T : null;
    }
    const row = this.mem.get(key);
    if (!row) return null;
    if (Date.now() > row.e) { this.mem.delete(key); return null; }
    return row.v as T;
  }

  async set(key: string, val: any, ttlSec: number){
    if (this.redis){
      await this.redis.set(key, JSON.stringify(val), 'EX', ttlSec);
      return;
    }
    this.mem.set(key, { v: val, e: Date.now() + ttlSec*1000 });
  }

  async del(prefixOrKey: string){
    if (this.redis){
      const keys = await this.redis.keys(prefixOrKey+'*');
      if (keys.length) await this.redis.del(keys);
      return;
    }
    for (const k of Array.from(this.mem.keys())){
      if (k.startsWith(prefixOrKey)) this.mem.delete(k);
    }
  }
}
