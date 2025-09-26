/* Stage 24 — Resolver example for GQL op: BookReservation
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class BookReservationResolver {
  @Query(()=>String, { name: 'BookReservation' })
  BookReservation(): string { return 'parity'; }
}
*/
