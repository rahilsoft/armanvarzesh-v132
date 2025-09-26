
import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [SurveyService, SurveyResolver, PrismaService],
  exports: [SurveyService]
})
export class SurveyModule {}
