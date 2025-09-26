import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';
@Module({ controllers:[MetricsController] })
export class MetricsModule implements NestModule { configure(c:MiddlewareConsumer){ c.apply(MetricsMiddleware).forRoutes('*'); } }
