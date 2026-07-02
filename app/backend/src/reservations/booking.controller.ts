import { Body, Controller, Get, Post, Query, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { BookingService } from './booking.service';

/**
 * Canonical REST surface for the Booking domain (folded from
 * services/booking-service — same `/booking/*` routes, ids now Int).
 */

class CreateSlotDto {
  @IsInt() coachId!: number;
  @IsISO8601() startUTC!: string;
  @IsISO8601() endUTC!: string;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
}

class CreateBookingDto {
  @IsInt() userId!: number;
  @IsInt() coachId!: number;
  @IsInt() slotId!: number;
  @IsIn(['online', 'in_person']) mode!: string;
}

class CancelBookingDto {
  @IsInt() userId!: number;
  @IsInt() id!: number;
}

class RescheduleDto {
  @IsInt() userId!: number;
  @IsInt() id!: number;
  @IsInt() newSlotId!: number;
}

class HoldDto {
  @IsInt() slotId!: number;
}

class PaymentSuccessDto {
  @IsInt() bookingId!: number;
  @IsString() paymentRef!: string;
}

@Controller('booking')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Post('slots/create')
  createSlot(@Body() dto: CreateSlotDto) {
    return this.booking.createSlot(dto.coachId, dto.startUTC, dto.endUTC, dto.capacity ?? 1);
  }

  @Post('create')
  create(@Body() dto: CreateBookingDto) {
    return this.booking.createBooking(dto.userId, dto.coachId, dto.slotId, dto.mode);
  }

  @Post('cancel')
  cancel(@Body() dto: CancelBookingDto) {
    return this.booking.cancelBooking(dto.userId, dto.id);
  }

  @Post('reschedule')
  reschedule(@Body() dto: RescheduleDto) {
    return this.booking.reschedule(dto.userId, dto.id, dto.newSlotId);
  }

  @Post('hold')
  hold(@Body() dto: HoldDto) {
    return this.booking.holdSlot(dto.slotId);
  }

  // Receiving end of the Payments-domain BOOKING_PAYMENT_SUCCEEDED outbox event.
  @Post('payments/success')
  paymentSuccess(@Body() dto: PaymentSuccessDto) {
    return this.booking.confirmPayment(dto.bookingId, dto.paymentRef);
  }

  @Get('mine')
  mine(@Query('userId', ParseIntPipe) userId: number) {
    return this.booking.listMy(userId);
  }

  @Post('cron/expire')
  async expire() {
    await this.booking.expireStale();
    return { ok: true };
  }
}
