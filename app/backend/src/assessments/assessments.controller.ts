import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsArray, IsInt } from 'class-validator';
import { AssessmentsService, Answer } from './assessments.service';

class SubmitDto {
  @IsInt() userId!: number;
  @IsArray() answers!: Answer[];
}

@Controller('assessments')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AssessmentsController {
  constructor(private readonly assessments: AssessmentsService) {}

  @Get()
  list() {
    return this.assessments.list();
  }

  @Get('mine')
  mine(@Query('userId', ParseIntPipe) userId: number) {
    return this.assessments.myAttempts(userId);
  }

  @Get('results/:attemptId')
  result(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.assessments.assessmentResult(attemptId);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.assessments.getAssessment(id);
  }

  @Post(':id/submit')
  submit(@Param('id', ParseIntPipe) id: number, @Body() dto: SubmitDto) {
    return this.assessments.submitAssessment({ userId: dto.userId, assessmentId: id, answers: dto.answers });
  }
}
