import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Public } from '../common/auth/public.decorator';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';
import { verifyWebhookSignature } from '../common/security/webhook-signature';

/**
 * Canonical REST surface for the Booking domain. User identity comes from the
 * JWT (not the body). `payments/success` is the async callback from the
 * Payments outbox relay — authenticated by HMAC signature.
 */

class CreateSlotDto {
  @IsInt() coachId!: number;
  @IsISO8601() startUTC!: string;
  @IsISO8601() endUTC!: string;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
}

class CreateBookingDto {
  @IsInt() coachId!: number;
  @IsInt() slotId!: number;
  @IsIn(['online', 'in_person']) mode!: string;
}

class BookingIdDto {
  @IsInt() id!: number;
}

class RescheduleDto {
  @IsInt() id!: number;
  @IsInt() newSlotId!: number;
}

class HoldDto {
  @IsInt() slotId!: number;
}

class PaymentSuccessDto {
  @IsInt() bookingId!: number;
  @IsString() paymentRef!: string;
  @IsOptional() @IsString() signature?: string;
}

@Controller('booking')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Post('slots/create')
  createSlot(@Body() dto: CreateSlotDto) {
    return this.booking.createSlot(dto.coachId, dto.startUTC, dto.endUTC, dto.capacity ?? 1);
  }

  @Post('create')
  create(@CurrentUser() user: AuthPrincipal, @Body() dto: CreateBookingDto) {
    return this.booking.createBooking(user.userId, dto.coachId, dto.slotId, dto.mode);
  }

  @Post('cancel')
  cancel(@CurrentUser() user: AuthPrincipal, @Body() dto: BookingIdDto) {
    return this.booking.cancelBooking(user.userId, dto.id);
  }

  @Post('reschedule')
  reschedule(@CurrentUser() user: AuthPrincipal, @Body() dto: RescheduleDto) {
    return this.booking.reschedule(user.userId, dto.id, dto.newSlotId);
  }

  @Post('hold')
  hold(@Body() dto: HoldDto) {
    return this.booking.holdSlot(dto.slotId);
  }

  // Public: receiving end of the Payments-domain BOOKING_PAYMENT_SUCCEEDED
  // event (delivered by the outbox relay). Authenticated by HMAC signature.
  @Public()
  @Post('payments/success')
  paymentSuccess(@Body() dto: PaymentSuccessDto) {
    verifyWebhookSignature('booking', dto, process.env.PAYMENTS_WEBHOOK_SECRET);
    return this.booking.confirmPayment(dto.bookingId, dto.paymentRef);
  }

  @Get('mine')
  mine(@CurrentUser() user: AuthPrincipal) {
    return this.booking.listMy(user.userId);
  }

  @Post('cron/expire')
  async expire() {
    await this.booking.expireStale();
    return { ok: true };
  }
}
