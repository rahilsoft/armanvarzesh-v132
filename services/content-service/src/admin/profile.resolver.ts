
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { PrismaClient, ServiceType } from '@prisma/client';
const prisma = new PrismaClient();
function ctxRole(ctx:any){ try{ return ctx?.req?.headers?.['x-role']||'guest'; }catch(e){ return 'guest'; } }
function mustAdmin(ctx:any){ if (process.env.SKIP_AUTH==='1') return; if (ctxRole(ctx)!=='admin') throw new Error('forbidden'); }

@Resolver()
export class ProfileAdminResolver{
  @Mutation(()=> Boolean)
  async upsertSpecialistProfile(
    @Args('specialistId') specialistId:string,
    @Args('role') role:ServiceType,
    @Args('displayName') displayName:string,
    @Args('bio',{nullable:true}) bio?:string,
    @Args('avatarUrl',{nullable:true}) avatarUrl?:string,
    @Args('introVideoUrl',{nullable:true}) introVideoUrl?:string,
    @Args('tagsJson',{nullable:true}) tagsJson?:string,
    @Context() ctx:any
  ): Promise<boolean>{
    mustAdmin(ctx);
    const tags = tagsJson? JSON.parse(tagsJson): null;
    await prisma.specialistProfile.upsert({ where:{ specialistId }, update:{ role, displayName, bio, avatarUrl, introVideoUrl, tags }, create:{ specialistId, role, displayName, bio, avatarUrl, introVideoUrl, tags } });
    return true;
  }

  @Query(()=> String)
  async listSpecialistProfiles(): Promise<string>{
    const rows = await prisma.specialistProfile.findMany({ orderBy:{ createdAt:'desc' } });
    return JSON.stringify(rows);
  }
}
