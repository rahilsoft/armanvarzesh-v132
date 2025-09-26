/* Stage 29 — Final Resolver example for op AssignPlan
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class AssignPlanResolver {
  @Query(()=>String, { name: 'AssignPlan' })
  AssignPlan(){ return 'ok'; }
}
*/
