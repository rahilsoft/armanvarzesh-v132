/* Stage 24 — Resolver example for GQL op: CoachAvailability
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class CoachAvailabilityResolver {
  @Query(()=>String, { name: 'CoachAvailability' })
  CoachAvailability(): string { return 'parity'; }
}
*/
