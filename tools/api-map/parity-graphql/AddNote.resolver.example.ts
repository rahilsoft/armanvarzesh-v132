/* Stage 24 — Resolver example for GQL op: AddNote
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class AddNoteResolver {
  @Query(()=>String, { name: 'AddNote' })
  AddNote(): string { return 'parity'; }
}
*/
