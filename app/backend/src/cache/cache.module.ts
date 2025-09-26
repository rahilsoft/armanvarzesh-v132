// Phase J — Cache module skeleton using cache-manager
import { CacheModule, Module } from '@nestjs/common';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: parseInt(process.env.CACHE_TTL || '10', 10),
      max: parseInt(process.env.CACHE_MAX || '100', 10),
    }),
  ],
})
export class AppCacheModule {}
