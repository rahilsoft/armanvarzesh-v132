
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient, ServiceType } from '@prisma/client';
const prisma = new PrismaClient();

function ctxUser(ctx:any){ try{ return ctx?.req?.headers?.['x-user-id'] || null; }catch(e){ return null; } }
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role'] || 'guest'; }catch(e){ return 'guest'; } }
function mustAny(ctx:any, roles:string[]){ if (process.env.SKIP_AUTH==='1') return; const r = ctxRole(ctx); if (r==='admin') return; if (!roles.includes(r)) throw new Error('forbidden'); }

@Resolver()
export class SpecialistResolver {
  @Query(()=> String)
  async getSpecialistMeta(@Args('specialistId') specialistId:string): Promise<string>{
    const m = await prisma.specialistMeta.findUnique({ where:{ specialistId } });
    return JSON.stringify(m||{});
  }

  @Mutation(()=> Boolean)
  async updateSpecialistMeta(
    @Args('specialistId') specialistId:string,
    @Args('role',{nullable:true}) role?:ServiceType,
    @Args('tags',{nullable:true}) tags?:string,
    @Args('genderFocus',{nullable:true}) genderFocus?:string,
    @Args('minAge',{nullable:true}) minAge?:number,
    @Args('maxAge',{nullable:true}) maxAge?:number,
    @Args('bio',{nullable:true}) bio?:string,
    @Args('introVideoUrl',{nullable:true}) introVideoUrl?:string,
    @Context() ctx:any
  ): Promise<boolean>{
    mustAny(ctx, ['admin','coach','specialist']);
    await prisma.specialistMeta.upsert({
      where:{ specialistId },
      update:{ role, tags, genderFocus, minAge, maxAge, bio, introVideoUrl, activeAt: new Date() },
      create:{ specialistId, role, tags, genderFocus, minAge, maxAge, bio, introVideoUrl, activeAt: new Date() }
    });
    return true;
  }

  @Mutation(()=> Boolean)
  async pingActive(@Args('specialistId') specialistId:string, @Context() ctx:any): Promise<boolean>{
    mustAny(ctx, ['admin','coach','specialist']);
    await prisma.specialistMeta.update({ where:{ specialistId }, data:{ activeAt: new Date() } });
    return true;
  }
}
