import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Reservation } from './entities/reservation.entity';
import { AvailabilitySlot } from './entities/availability.entity';
import { CreateReservationInput } from './dto/reservation.input';
import { CreateAvailabilityInput } from './dto/availability.input';
import { ReservationService, AvailabilityService } from './reservation.service';
import { GqlJwtAuthGuard } from '../matching/gql-jwt-auth.guard';
import { GqlCurrentUser, AuthPrincipal } from '../common/auth/current-user.decorator';

const isAdmin = (u: AuthPrincipal) => u.role === 'admin';

/**
 * GraphQL reservations surface. Every mutation and every per-user query needs a
 * verified JWT, the acting user comes from the token, and cross-user access is
 * limited to admin principals. (REV-20261022-01)
 */
@Resolver()
export class ReservationsResolver {
  constructor(
    private readonly resv: ReservationService,
    private readonly avail: AvailabilityService
  ) {}

  // Access tokens carry no coach claim yet, so publishing availability for an
  // arbitrary coachId is admin-only until coach identity is in the token.
  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => AvailabilitySlot)
  async createAvailability(@GqlCurrentUser() user: AuthPrincipal, @Args('input') input: CreateAvailabilityInput) {
    if (!isAdmin(user)) throw new ForbiddenException('admin only');
    return this.avail.createAvailability(input as any);
  }

  @Query(() => [AvailabilitySlot])
  async coachAvailability(@Args('coachId') coachId: string) {
    return this.avail.listCoachAvailability(coachId);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Reservation)
  async bookReservation(@GqlCurrentUser() user: AuthPrincipal, @Args('input') input: CreateReservationInput) {
    const r = await this.resv.reserve(String(user.userId), input.slotId);
    return {
      id: r.id,
      userId: r.userId,
      coachId: input.coachId,
      slotId: r.slotId,
      status: r.status,
      start: r.startsAt ?? new Date(0),
      end: r.endsAt ?? new Date(0),
      createdAt: r.createdAt ?? new Date(),
    };
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Boolean)
  async cancelReservation(@GqlCurrentUser() user: AuthPrincipal, @Args('id') id: string) {
    await this.resv.cancel(id, { userId: String(user.userId), isAdmin: isAdmin(user) });
    return true;
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Reservation])
  async userReservations(@GqlCurrentUser() user: AuthPrincipal, @Args('userId', { nullable: true }) userId?: string) {
    const target = userId ? Number(userId) : user.userId;
    if (target !== user.userId && !isAdmin(user)) throw new ForbiddenException('not your reservations');
    return this.resv.listByUser(target);
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [Reservation])
  async coachReservations(@GqlCurrentUser() user: AuthPrincipal, @Args('coachId') coachId: string) {
    if (!isAdmin(user)) throw new ForbiddenException('admin only');
    return this.resv.listByCoach(Number(coachId));
  }
}
