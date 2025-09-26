import { EnvValidationModule } from '@arman/shared';
import { CacheModule } from '@nestjs/cache-manager';
import { LoaderRegistry } from './dataloader';
import { extraApolloConfig } from './config/graphql.config';
import { MetricsController } from './main';
import { HealthController } from './health/health.controller';
import { Module } from '@nestjs/common';
import { buildLoaders } from './graphql/dataloader';
import { MetricsModule } from './metrics/metrics.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { VipModule } from './vip/vip.module';

@Module({
  providers: [LoaderRegistry],
  controllers: [HealthController, MetricsController],
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const url = process.env.REDIS_URL;
        if (!url) { return { ttl: 1000 * 60 }; }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { redisStore } = require('cache-manager-redis-yet');
        return { store: await redisStore({ url }), ttl: 1000 * 60 };
      },
    }),MetricsModule,
    ThrottlerModule.forRoot({ ttl: Number(process.env.RATE_LIMIT_TTL) || 60, limit: Number(process.env.RATE_LIMIT_LIMIT) || 100 }),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
    HealthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      ...extraApolloConfig,
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      playground: process.env.NODE_ENV !== 'production',
    }),
    VipModule,EnvValidationModule],
})
export class AppModule {}