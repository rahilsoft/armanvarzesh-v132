import { Body, Controller, Get, Post, Query, ParseFloatPipe, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsArray, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { MedicalService } from './medical.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';
import { verifyWebhookSignature } from '../common/security/webhook-signature';

/** Canonical REST surface for the Medical domain. User identity comes from the
 *  JWT; the lab results-ready webhook is HMAC-authenticated. */

class BookAppointmentDto {
  @IsInt() facilityId!: number;
  @IsInt() doctorId!: number;
  @IsArray() @IsInt({ each: true }) testIds!: number[];
  @IsInt() clinicSlotId!: number;
}

class AppointmentIdDto {
  @IsInt() id!: number;
}

class RescheduleDto {
  @IsInt() id!: number;
  @IsInt() newClinicSlotId!: number;
}

class ResultsReadyDto {
  @IsInt() appointmentId!: number;
  @IsString() @MinLength(1) summary!: string;
  @IsOptional() @IsString() signature?: string;
}

@Controller('medical')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class MedicalController {
  constructor(private readonly medical: MedicalService) {}

  @Public()
  @Get('testsCatalog')
  testsCatalog() {
    return this.medical.testsCatalog();
  }

  @Public()
  @Get('nearbyFacilities')
  nearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.medical.nearbyFacilities({ lat, lng }, radiusKm ? Number(radiusKm) : undefined);
  }

  @Get('myAppointments')
  myAppointments(@CurrentUser() user: AuthPrincipal) {
    return this.medical.myAppointments(user.userId);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthPrincipal) {
    return this.medical.myMedicalSummary(user.userId);
  }

  @Post('bookAppointment')
  book(@CurrentUser() user: AuthPrincipal, @Body() dto: BookAppointmentDto) {
    return this.medical.bookAppointment(user.userId, dto.facilityId, dto.doctorId, dto.testIds, dto.clinicSlotId);
  }

  @Post('cancelAppointment')
  cancel(@CurrentUser() user: AuthPrincipal, @Body() dto: AppointmentIdDto) {
    return this.medical.cancelAppointment(user.userId, dto.id);
  }

  @Post('reschedule')
  reschedule(@CurrentUser() user: AuthPrincipal, @Body() dto: RescheduleDto) {
    return this.medical.reschedule(user.userId, dto.id, dto.newClinicSlotId);
  }

  // Public: lab → server callback, authenticated by HMAC signature.
  @Public()
  @Post('webhooks/results-ready')
  resultsReady(@Body() dto: ResultsReadyDto) {
    verifyWebhookSignature('medical', dto, process.env.MEDICAL_WEBHOOK_SECRET);
    return this.medical.onResultsReady(dto.appointmentId, dto.summary);
  }
}
