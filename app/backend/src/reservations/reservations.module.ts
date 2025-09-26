import { Module } from '@nestjs/common';
import { ReservationsResolver } from './reservations.resolver';
import { ReservationService, AvailabilityService } from './reservation.service';

@Module({
  providers: [ReservationsResolver, ReservationService, AvailabilityService],
  exports: [ReservationService, AvailabilityService]
})
export class ReservationsModule {}
