import { Body, Controller, Get, Post, Query, ParseIntPipe, ParseFloatPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsArray, IsInt, IsString, MinLength } from 'class-validator';
import { MedicalService } from './medical.service';

/** Canonical REST surface for the Medical domain — same `/medical/*` routes
 *  as the former services/medical-service, ids now Int. */

class BookAppointmentDto {
  @IsInt() userId!: number;
  @IsInt() facilityId!: number;
  @IsInt() doctorId!: number;
  @IsArray() @IsInt({ each: true }) testIds!: number[];
  @IsInt() clinicSlotId!: number;
}

class CancelDto {
  @IsInt() userId!: number;
  @IsInt() id!: number;
}

class RescheduleDto {
  @IsInt() userId!: number;
  @IsInt() id!: number;
  @IsInt() newClinicSlotId!: number;
}

class ResultsReadyDto {
  @IsInt() appointmentId!: number;
  @IsString() @MinLength(1) summary!: string;
}

@Controller('medical')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class MedicalController {
  constructor(private readonly medical: MedicalService) {}

  @Get('testsCatalog')
  testsCatalog() {
    return this.medical.testsCatalog();
  }

  @Get('nearbyFacilities')
  nearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radiusKm') radiusKm?: string,
  ) {
    return this.medical.nearbyFacilities({ lat, lng }, radiusKm ? Number(radiusKm) : undefined);
  }

  @Get('myAppointments')
  myAppointments(@Query('userId', ParseIntPipe) userId: number) {
    return this.medical.myAppointments(userId);
  }

  @Get('summary')
  summary(@Query('userId', ParseIntPipe) userId: number) {
    return this.medical.myMedicalSummary(userId);
  }

  @Post('bookAppointment')
  book(@Body() dto: BookAppointmentDto) {
    return this.medical.bookAppointment(dto.userId, dto.facilityId, dto.doctorId, dto.testIds, dto.clinicSlotId);
  }

  @Post('cancelAppointment')
  cancel(@Body() dto: CancelDto) {
    return this.medical.cancelAppointment(dto.userId, dto.id);
  }

  @Post('reschedule')
  reschedule(@Body() dto: RescheduleDto) {
    return this.medical.reschedule(dto.userId, dto.id, dto.newClinicSlotId);
  }

  @Post('webhooks/results-ready')
  resultsReady(@Body() dto: ResultsReadyDto) {
    return this.medical.onResultsReady(dto.appointmentId, dto.summary);
  }
}
