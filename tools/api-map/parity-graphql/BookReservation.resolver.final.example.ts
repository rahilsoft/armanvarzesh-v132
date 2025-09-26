/* Stage 29 — Final Resolver example for op BookReservation
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class BookReservationResolver {
  @Query(()=>String, { name: 'BookReservation' })
  BookReservation(){ return 'ok'; }
}
*/
