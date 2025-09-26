/* Stage 24 — Resolver example for GQL op: CancelReservation
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class CancelReservationResolver {
  @Query(()=>String, { name: 'CancelReservation' })
  CancelReservation(): string { return 'parity'; }
}
*/
