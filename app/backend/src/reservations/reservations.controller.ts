import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationService } from './reservation.service';
import { withSpan } from '../observability/tracing';
import { reservationsCreated } from '../observability/metrics';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

/**
 * REST reservations surface. Identity comes only from the verified JWT
 * (JwtAuthGuard + CurrentUser), never from the request body: a `userId` in the
 * body is rejected by the whitelist pipe. Cancel is restricted to the owner of
 * the reservation (or an admin principal), enforced inside the DB update.
 * (REV-20261022-01)
 */
class ReserveDto {
  @Type(() => Number) @IsInt() @Min(1) slotId!: number;
}

class CancelDto {
  @Type(() => Number) @IsInt() @Min(1) reservationId!: number;
}

@Controller('reservations')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class ReservationsController {
  constructor(private readonly reservations: ReservationService) {}

  @Post('reserve')
  async reserve(@CurrentUser() user: AuthPrincipal, @Body() dto: ReserveDto) {
    return await withSpan('reservations.reserve', { 'user.id': user.userId, 'slot.id': dto.slotId }, async () => {
      const r = await this.reservations.reserve(String(user.userId), String(dto.slotId));
      reservationsCreated.inc({ status: 'ok' });
      return { ok: true, reservation: { id: r.id, slotId: r.slotId } };
    });
  }

  @Post('cancel')
  async cancel(@CurrentUser() user: AuthPrincipal, @Body() dto: CancelDto) {
    return await withSpan('reservations.cancel', { 'reservation.id': dto.reservationId, 'user.id': user.userId }, async () => {
      const r = await this.reservations.cancel(String(dto.reservationId), {
        userId: String(user.userId),
        isAdmin: user.role === 'admin',
      });
      reservationsCreated.inc({ status: 'cancel' });
      return { ok: true, reservation: { id: r.id } };
    });
  }
}
