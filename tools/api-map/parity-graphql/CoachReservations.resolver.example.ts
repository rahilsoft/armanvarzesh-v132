/* Stage 24 — Resolver example for GQL op: CoachReservations
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class CoachReservationsResolver {
  @Query(()=>String, { name: 'CoachReservations' })
  CoachReservations(): string { return 'parity'; }
}
*/
