import { Body, Controller, Get, Post, Query, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { PhysioService } from './physio.service';

/** Canonical REST surface for the Physio domain (folded from
 *  services/physio-service; ids now Int). */

class AssignDto {
  @IsInt() userId!: number;
  @IsInt() protocolId!: number;
}

class CompleteSessionDto {
  @IsInt() userId!: number;
  @IsInt() sessionId!: number;
}

class LogPainDto {
  @IsInt() userId!: number;
  @IsInt() sessionId!: number;
  @IsInt() @Min(0) @Max(10) score!: number;
  @IsOptional() @IsString() notes?: string;
}

class RecordRomDto {
  @IsInt() userId!: number;
  @IsString() @MinLength(1) joint!: string;
  @IsIn(['left', 'right', 'bilateral']) side!: 'left' | 'right' | 'bilateral';
  @IsInt() @Min(0) @Max(360) angle!: number;
}

@Controller('physio')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class PhysioController {
  constructor(private readonly physio: PhysioService) {}

  @Post('assign')
  assign(@Body() dto: AssignDto) {
    return this.physio.assignProtocol(dto.userId, dto.protocolId);
  }

  @Get('myPlan')
  myPlan(@Query('userId', ParseIntPipe) userId: number) {
    return this.physio.myPlan(userId);
  }

  @Post('sessions/complete')
  complete(@Body() dto: CompleteSessionDto) {
    return this.physio.completeSession(dto.sessionId, dto.userId);
  }

  @Post('pain')
  logPain(@Body() dto: LogPainDto) {
    return this.physio.logPain(dto.sessionId, dto.score, dto.notes, dto.userId);
  }

  @Post('rom')
  recordRom(@Body() dto: RecordRomDto) {
    return this.physio.recordRom(dto.userId, dto.joint, dto.side, dto.angle);
  }

  @Get('progress')
  progress(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.physio.progress(userId, { from, to });
  }
}
