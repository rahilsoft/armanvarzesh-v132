import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, seconds, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { envValidationSchema } from './src/config/env.validation';
import configuration from './src/config/configuration';
import { graphqlConfig } from './src/config/graphql.config';

import { AuthModule } from './src/auth/auth.module';
import { UsersModule } from './src/users/users.module';
import { CoachesModule } from './src/coaches/coaches.module';
import { WorkoutsModule } from './src/workouts/workouts.module';
import { NutritionModule } from './src/nutrition/nutrition.module';
import { PaymentsModule } from './src/payments/payments.module';
import { WalletModule } from './src/wallet/wallet.module';
import { MarketplaceModule } from './src/marketplace/marketplace.module';
import { NotificationsModule } from './src/notifications/notifications.module';
import { LeaderboardModule } from './src/leaderboard/leaderboard.module';
import { ChallengesModule } from './src/challenges/challenges.module';
import { AiModule } from './src/ai/ai.module';
import { CorporateModule } from './src/corporate/corporate.module';
import { LiveModule } from './src/live/live.module';
import { AdminModule } from './src/admin/admin.module';
import { AnalyticsModule } from './src/analytics/analytics.module';
import { PayrollModule } from './src/payroll/payroll.module';
import { SupportModule } from './src/support/support.module';
import { CmsModule } from './src/cms/cms.module';
import { ExperimentsModule } from './src/experiments/experiments.module';
import { SurveyModule } from './src/survey/survey.module';
import { SecurityModule } from './src/security/security.module';
import { ChatModule } from './src/chat/chat.module';
import { HealthModule } from './src/health/health.module';

@Module({
  imports: [ ThrottlerModule.forRoot({ throttlers: [{ ttl: seconds(Number(process.env.RATE_LIMIT_TTL || '60')), limit: Number(process.env.RATE_LIMIT_LIMIT || '60') }] }), 
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validationSchema: envValidationSchema }),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphqlConfig),
    AuthModule,
    UsersModule,
    CoachesModule,
    WorkoutsModule,
    NutritionModule,
    PaymentsModule,
    WalletModule,
    MarketplaceModule,
    NotificationsModule,
    LeaderboardModule,
    ChallengesModule,
    AiModule,
    CorporateModule,
    LiveModule,
    AdminModule,
    AnalyticsModule,
    PayrollModule,
    SupportModule,
    CmsModule,
    ExperimentsModule,
    SurveyModule,
    SecurityModule
    ,
    ChatModule,
    HealthModule
  ],

  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard }
  ]
})
export class AppModule {}
