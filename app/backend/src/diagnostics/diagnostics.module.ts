import { Module } from '@nestjs/common';
import { DiagnosticsResolver } from './diagnostics.resolver';

@Module({
  providers: [DiagnosticsResolver],
})
export class DiagnosticsModule {}
