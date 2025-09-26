/* Stage 29 — Final Resolver example for op CancelReservation
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class CancelReservationResolver {
  @Query(()=>String, { name: 'CancelReservation' })
  CancelReservation(){ return 'ok'; }
}
*/
