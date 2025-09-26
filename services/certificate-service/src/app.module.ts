import { MetricsController } from './metrics/metrics.controller';
import { HealthController } from './health/health.controller';
import { Module } from '@nestjs/common';
import { CertificateModule } from './certificate/certificate.module';
@Module({ imports: [CertificateModule] })
export class AppModule {}
