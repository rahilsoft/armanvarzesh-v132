import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { PhysioService } from './physio.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

/** Canonical REST surface for the Physio domain (folded from
 *  services/physio-service; ids now Int). User identity comes from the JWT. */

class AssignDto {
  @IsInt() protocolId!: number;
}

class CompleteSessionDto {
  @IsInt() sessionId!: number;
}

class LogPainDto {
  @IsInt() sessionId!: number;
  @IsInt() @Min(0) @Max(10) score!: number;
  @IsOptional() @IsString() notes?: string;
}

class RecordRomDto {
  @IsString() @MinLength(1) joint!: string;
  @IsIn(['left', 'right', 'bilateral']) side!: 'left' | 'right' | 'bilateral';
  @IsInt() @Min(0) @Max(360) angle!: number;
}

@Controller('physio')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class PhysioController {
  constructor(private readonly physio: PhysioService) {}

  @Post('assign')
  assign(@CurrentUser() user: AuthPrincipal, @Body() dto: AssignDto) {
    return this.physio.assignProtocol(user.userId, dto.protocolId);
  }

  @Get('myPlan')
  myPlan(@CurrentUser() user: AuthPrincipal) {
    return this.physio.myPlan(user.userId);
  }

  @Post('sessions/complete')
  complete(@CurrentUser() user: AuthPrincipal, @Body() dto: CompleteSessionDto) {
    return this.physio.completeSession(dto.sessionId, user.userId);
  }

  @Post('pain')
  logPain(@CurrentUser() user: AuthPrincipal, @Body() dto: LogPainDto) {
    return this.physio.logPain(dto.sessionId, dto.score, dto.notes, user.userId);
  }

  @Post('rom')
  recordRom(@CurrentUser() user: AuthPrincipal, @Body() dto: RecordRomDto) {
    return this.physio.recordRom(user.userId, dto.joint, dto.side, dto.angle);
  }

  @Get('progress')
  progress(
    @CurrentUser() user: AuthPrincipal,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.physio.progress(user.userId, { from, to });
  }
}
