
import { Resolver, Query, Args } from '@nestjs/graphql';
import { PrismaClient, ServiceType } from '@prisma/client';
const prisma = new PrismaClient();

@Resolver()
export class FunnelResolver {
  @Query(()=> String)
  async funnelMetrics(@Args('from') from:string, @Args('to') to:string, @Args('role',{nullable:true}) role?:ServiceType): Promise<string>{
    const start = new Date(from), end = new Date(to);
    const roleFilter = role? { serviceType: role } : {};
    const leads = await prisma.lead.count({ where:{ createdAt:{ gte:start, lte:end }, ...(roleFilter as any) } });
    const chats = leads; // lead == start chat in this model
    const conv = await prisma.conversionEvent.count({ where:{ kind:'FREE_TO_PREMIUM', at:{ gte:start, lte:end }, ...(roleFilter as any) } });
    const renew = await prisma.conversionEvent.count({ where:{ kind:'RENEWAL', at:{ gte:start, lte:end }, ...(roleFilter as any) } });
    const obj = { leads, chats, conversions: conv, renewals: renew };
    return JSON.stringify(obj);
  }
}
