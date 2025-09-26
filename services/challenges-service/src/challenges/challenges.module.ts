import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesResolver } from './challenges.resolver';

@Module({
  providers: [ChallengesService, ChallengesResolver],
})
export class ChallengesModule {}