/* Stage 18 TelemetryModule (example) */
import { Module, Global, MiddlewareConsumer, NestModule } from '@nestjs/common';
@Global()
@Module({})
export class TelemetryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
