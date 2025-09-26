
import { Controller, Get, Param } from '@nestjs/common';
import { SurveyService } from '../survey.service';
import { Survey } from '../entities/survey.entity';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Survey[]> {
    return this.surveyService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Survey> {
    return this.surveyService.findOne(Number(id));
  }
}