import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { LoaderRegistry } from './dataloader';
import { extraApolloConfig } from './config/graphql.config';
import { EnvValidationModule } from '@arman/shared';
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
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './database/prisma.service';

/**
 * Root module for the authentication microservice. Provides GraphQL
 * capabilities, JWT configuration and exposes the AuthModule.
 */
@Module({
  controllers: [HealthController, MetricsController, AuthController],
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
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
      context: ({ req }) => ({ req, loaders: buildLoaders() }),
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'production'
    }),
    JwtModule.registerAsync({
  useFactory: () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) { throw new Error('JWT_SECRET is required'); }
    return { secret, signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } };
  },
}),
    AuthModule, EnvValidationModule],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    LoaderRegistry,PrismaService]
})
export class AppModule {}