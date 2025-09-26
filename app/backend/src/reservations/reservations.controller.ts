import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { withSpan } from '../observability/tracing';
import { reservationsCreated } from '../observability/metrics';
import { JwtKidService } from '../security/jwt-rotator.service';

@Controller('reservations')
export class ReservationsController {
  private jwt = new JwtKidService();
  constructor(private readonly reservations: ReservationService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('reserve')
  async reserve(@Body() body: any) {
    // Optional auth via JWT (if Authorization header provided)
    return await withSpan('reservations.reserve', { 'user.id': body.userId, 'slot.id': body.slotId }, async () => {
      const r = await this.reservations.reserve(body.userId, body.slotId);
      reservationsCreated.inc({ status: 'ok' });
      return { ok: true, reservation: { id: r.id, slotId: r.slotId } };
    });
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post('cancel')
  async cancel(@Body() body: any) {
    return await withSpan('reservations.cancel', { 'reservation.id': body.reservationId }, async () => {
      const r = await this.reservations.cancel(body.reservationId);
      reservationsCreated.inc({ status: 'cancel' });
      return { ok: true, reservation: { id: r.id } };
    });
  }
}