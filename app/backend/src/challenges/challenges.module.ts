
import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesResolver } from './challenges.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [ChallengesService, ChallengesResolver, PrismaService],
  exports: [ChallengesService]
})
export class ChallengesModule {}
