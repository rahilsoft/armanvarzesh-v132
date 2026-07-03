import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsArray } from 'class-validator';
import { AssessmentsService, Answer } from './assessments.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

class SubmitDto {
  @IsArray() answers!: Answer[];
}

@Controller('assessments')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AssessmentsController {
  constructor(private readonly assessments: AssessmentsService) {}

  @Public()
  @Get()
  list() {
    return this.assessments.list();
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthPrincipal) {
    return this.assessments.myAttempts(user.userId);
  }

  @Get('results/:attemptId')
  result(@Param('attemptId', ParseIntPipe) attemptId: number) {
    return this.assessments.assessmentResult(attemptId);
  }

  @Public()
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.assessments.getAssessment(id);
  }

  @Post(':id/submit')
  submit(@CurrentUser() user: AuthPrincipal, @Param('id', ParseIntPipe) id: number, @Body() dto: SubmitDto) {
    return this.assessments.submitAssessment({ userId: user.userId, assessmentId: id, answers: dto.answers });
  }
}
