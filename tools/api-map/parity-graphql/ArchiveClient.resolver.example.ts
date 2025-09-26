/* Stage 24 — Resolver example for GQL op: ArchiveClient
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class ArchiveClientResolver {
  @Query(()=>String, { name: 'ArchiveClient' })
  ArchiveClient(): string { return 'parity'; }
}
*/
