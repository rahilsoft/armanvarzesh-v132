/* Stage 24 — Resolver example for GQL op: AssignPlan
import { Resolver, Query } from '@nestjs/graphql';
@Resolver()
export class AssignPlanResolver {
  @Query(()=>String, { name: 'AssignPlan' })
  AssignPlan(): string { return 'parity'; }
}
*/
