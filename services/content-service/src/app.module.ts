import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { ContentModule } from './content/content.module';
import { ChatModule } from './chat/chat.module';
import { CorrectiveModule } from './corrective/corrective.module';
import { JobsModule } from './jobs/jobs.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { ScoringModule } from './scoring/scoring.module';
import { StorageModule } from './storage/storage.module';
import { SurveysModule } from './surveys/surveys.module';
import { TilesModule } from './tiles/tiles.module';
import { TilesPrismaModule } from './tiles-prisma/tiles-prisma.module';
import { UploadModule } from './upload/upload.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    HealthModule,
    MetricsModule,
    ContentModule,
    ChatModule,
    CorrectiveModule,
    JobsModule,
    MediaModule,
    NotificationsModule,
    NutritionModule,
    ScoringModule,
    StorageModule,
    SurveysModule,
    TilesModule,
    TilesPrismaModule,
    UploadModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
