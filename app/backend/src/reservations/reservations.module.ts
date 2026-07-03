import { Module } from '@nestjs/common';
import { ReservationsResolver } from './reservations.resolver';
import { ReservationService, AvailabilityService } from './reservation.service';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ReservationsController } from './reservations.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [
    PrismaService,
    ReservationsResolver, ReservationService, AvailabilityService,
    // Folded from services/booking-service (slots/holds/capacity/overlap).
    BookingService,
  ],
  controllers: [ReservationsController, BookingController],
  exports: [ReservationService, AvailabilityService, BookingService]
})
export class ReservationsModule {}
