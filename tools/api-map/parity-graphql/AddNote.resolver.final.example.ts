/* Stage 29 — Final Resolver example for op AddNote
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class AddNoteResolver {
  @Query(()=>String, { name: 'AddNote' })
  AddNote(){ return 'ok'; }
}
*/
