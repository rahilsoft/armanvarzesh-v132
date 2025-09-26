/* Stage 24 — Resolver example for GQL op: Clients
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class ClientsResolver {
  @Query(()=>String, { name: 'Clients' })
  Clients(): string { return 'parity'; }
}
*/
