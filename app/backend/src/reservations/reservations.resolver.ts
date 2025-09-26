import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Reservation } from './entities/reservation.entity';
import { AvailabilitySlot } from './entities/availability.entity';
import { CreateReservationInput } from './dto/reservation.input';
import { CreateAvailabilityInput } from './dto/availability.input';
import { ReservationService, AvailabilityService } from './reservation.service';

@Resolver()
export class ReservationsResolver {
  constructor(
    private readonly resv: ReservationService,
    private readonly avail: AvailabilityService
  ) {}

  @Mutation(() => AvailabilitySlot)
  async createAvailability(@Args('input') input: CreateAvailabilityInput) {
    return this.avail.createAvailability(input);
  }

  @Query(() => [AvailabilitySlot])
  async coachAvailability(@Args('coachId') coachId: string) {
    return this.avail.listCoachAvailability(coachId);
  }

  @Mutation(() => Reservation)
  async bookReservation(@Args('input') input: CreateReservationInput) {
    const data = await this.resv.reserve(input.userId, input.slotId);
    return {
      id: 'resv_'+Date.now(),
      userId: input.userId,
      coachId: input.coachId,
      slotId: input.slotId,
      status: 'CONFIRMED',
      start: new Date(),
      end: new Date(Date.now()+60*60*1000),
      createdAt: new Date()
    };
  }

  @Mutation(() => Boolean)
  async cancelReservation(@Args('id') id: string) {
    await this.resv.cancel(id);
    return true;
  }
}


@Query(() => [Reservation])
async userReservations(@Args('userId') userId: string) {
  return this.resv.listByUser(Number(userId));
}

@Query(() => [Reservation])
async coachReservations(@Args('coachId') coachId: string) {
  return this.resv.listByCoach(Number(coachId));
}
