
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { ctxUser } from '../auth/ctx';
const prisma = new PrismaClient();
function uid(ctx:any){ const u = ctxUser(ctx); if (!u) throw new Error('unauthenticated'); return u; }
@Resolver()
export class SurveyResolver {
  @Mutation(()=> Boolean)
  async submitSurvey(@Args('templateCode') templateCode:string, @Args('specialistId') specialistId:string, @Args('rating') rating:number, @Args('comment',{nullable:true}) comment?:string, @Context() ctx?: any): Promise<boolean>{
    await prisma.surveyResponse.create({ data:{ templateCode, specialistId, userId: uid(ctx), rating, comment } });
    return true;
  }
}
