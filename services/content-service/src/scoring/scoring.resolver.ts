
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ScoringService } from './scoring.service';
import { PrismaClient, ServiceType } from '@prisma/client';

import { ctxRole } from '../auth/ctx';
const prisma = new PrismaClient();
function mustAny(ctx:any, roles:string[]){ if (process.env.SKIP_AUTH==='1') return; const r = ctxRole(ctx); if (r==='admin') return; if (!roles.includes(r)) throw new Error('forbidden');
}

@Resolver()
export class ScoringResolver {
  constructor(private readonly svc: ScoringService){}

  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx?: any): Promise<boolean>{
    if (ctxRole(ctx)!=='admin') throw new Error('forbidden');
    await prisma.scoringWeights.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }

  @Mutation(()=> String)
  async recordConversion(@Args('userId') userId:string, @Args('specialistId') specialistId:string, @Args('serviceType') serviceType:ServiceType, @Args('kind') kind:string, @Context() ctx?: any): Promise<string>{
    mustAny(ctx, ['admin','coach','specialist']);
    const r = await prisma.conversionEvent.create({ data:{ userId, specialistId, serviceType, kind } });
    return r.id;
  
}

  @Mutation(()=> Boolean)
  async recomputeScore(@Args('specialistId') specialistId:string, @Args('role') role:ServiceType): Promise<boolean>{
    await this.svc.computeFor(specialistId, role);
    return true;
  
}

  @Query(()=> String)
  async topSpecialists(@Args('role') role:ServiceType, @Args('limit',{nullable:true}) limit?:number): Promise<string>{
    const rows = await this.svc.topByRole(role, limit||3);
    return JSON.stringify(rows);
  
}

}
