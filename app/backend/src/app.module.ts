import { JwksModule } from './jwks.module';
import { Module } from '@nestjs/common';
import { JwksController } from './auth/jwks.controller';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RolesGuard } from './auth/roles.guard';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './common/controllers/health.controller';
import { MetricsModule } from './metrics/metrics.module';

// Optional GraphQL bootstrap (Apollo v4 + @nestjs/apollo v12).
// Safe to keep even without resolvers; schema will be generated empty.
// Disable if not needed.
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LivekitModule } from './livekit/livekit.module';
import { MatchingModule } from './matching/matching.module';
import { CorrectiveModule } from './corrective/corrective.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { ChatModule } from './chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AppCacheModule } from './cache/cache.module';
import { AdminController } from './auth/admin.controller';
import { UserAuthModule } from './auth/user-auth.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MedicalModule } from './medical/medical.module';
import { PhysioModule } from './physio/physio.module';
import { CoursesModule } from './courses/courses.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({ imports: [ JwksModule, AppCacheModule, LivekitModule,
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        redact: ['req.headers.authorization', 'res.headers["set-cookie"]'],
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
      }
    }),
    MetricsModule,
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.GQL_SCHEMA_PATH || 'dist/schema.gql',
      sortSchema: true,
      csrfPrevention: true,
      playground: false,
      introspection: process.env.NODE_ENV !== 'production',
    }),
    MatchingModule,
    CorrectiveModule,
    NutritionModule,
    ChatModule,
    ReviewsModule,
    UserAuthModule,
    WorkoutsModule,
    ReservationsModule,
    GamificationModule,
    MedicalModule,
    PhysioModule,
    CoursesModule,
    AssessmentsModule,
  ],
  controllers: [AdminController,  JwksController, HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}