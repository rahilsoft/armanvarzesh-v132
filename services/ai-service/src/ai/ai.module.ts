import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';

/**
 * Module encapsulating the AI recommendation logic. Provides the
 * AiService and exposes GraphQL resolvers to generate workout plans.
 */
@Module({
  providers: [AiService, AiResolver],
})
export class AiModule {}