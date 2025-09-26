
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ScoringService } from './scoring.service';
import { PrismaClient, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();
function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } 
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role'] || 'guest'; }catch(e){ return 'guest'; } 
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}
function mustAny(ctx:any, roles:string[]){ if (process.env.SKIP_AUTH==='1') return; const r = ctxRole(ctx); if (r==='admin') return; if (!roles.includes(r)) throw new Error('forbidden'); 
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}

@Resolver()
export class ScoringResolver {
  constructor(private readonly svc: ScoringService){
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}

  @Mutation(()=> String)
  async recordConversion(@Args('userId') userId:string, @Args('specialistId') specialistId:string, @Args('serviceType') serviceType:ServiceType, @Args('kind') kind:string, @Context() ctx:any): Promise<string>{
    mustAny(ctx, ['admin','coach','specialist']);
    const r = await prisma.conversionEvent.create({ data:{ userId, specialistId, serviceType, kind } });
    return r.id;
  
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}

  @Mutation(()=> Boolean)
  async recomputeScore(@Args('specialistId') specialistId:string, @Args('role') role:ServiceType): Promise<boolean>{
    await this.svc.computeFor(specialistId, role);
    return true;
  
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}

  @Query(()=> String)
  async topSpecialists(@Args('role') role:ServiceType, @Args('limit',{nullable:true}) limit?:number): Promise<string>{
    const rows = await this.svc.topByRole(role, limit||3);
    return JSON.stringify(rows);
  
  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}

  @Mutation(()=> Boolean)
  async upsertWeights(@Args('role') role:ServiceType, @Args('json') json:any, @Context() ctx:any): Promise<boolean>{
    const r = ctx?.req?.headers?.['x-role']; if (r!=='admin') throw new Error('forbidden');
    await prisma.scoringWeight.upsert({ where:{ role }, update:{ weights: json }, create:{ role, weights: json } });
    return true;
  }
}
