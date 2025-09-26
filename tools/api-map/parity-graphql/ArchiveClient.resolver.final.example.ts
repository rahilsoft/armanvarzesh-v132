/* Stage 29 — Final Resolver example for op ArchiveClient
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class ArchiveClientResolver {
  @Query(()=>String, { name: 'ArchiveClient' })
  ArchiveClient(){ return 'ok'; }
}
*/
