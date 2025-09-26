
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { CorrectiveService } from './corrective.service';
import { ConditionType, CorrectiveVideoType } from './entities/condition.entity';
import { CreateConditionInput } from './dto/create-condition.input';
import { CreateCorrectiveVideoInput } from './dto/create-corrective-video.input';
import { SearchCorrectiveInput } from './dto/search-corrective.input';

function role(ctx:any){ try { return ctx?.req?.headers?.['x-role'] || 'guest'; } catch { return 'guest'; } }
function must(ctx:any, roles:string[]){ if (process.env.SKIP_AUTH==='1') return; const r = role(ctx); if (!roles.includes(r) && r!=='admin') throw new Error('forbidden'); }

@Resolver()
export class CorrectiveResolver {
  constructor(private readonly svc: CorrectiveService){}

  @Query(() => [ConditionType])
  correctiveConditions(){ return this.svc.listConditions(); }

  @Mutation(() => ConditionType)
  upsertCorrectiveCondition(@Args('input') input: CreateConditionInput, @Context() ctx:any){
    must(ctx, ['admin']); return this.svc.upsertCondition(input);
  }

  @Mutation(() => Boolean)
  deleteCorrectiveCondition(@Args('code') code:string, @Context() ctx:any){
    must(ctx, ['admin']); return this.svc.deleteCondition(code);
  }

  @Query(() => [CorrectiveVideoType])
  searchCorrectiveVideos(@Args('input', { nullable:true }) input: SearchCorrectiveInput){
    return this.svc.listVideos(input||undefined);
  }

  @Mutation(() => CorrectiveVideoType)
  uploadCorrectiveVideo(@Args('input') input: CreateCorrectiveVideoInput, @Context() ctx:any){
    must(ctx, ['specialist','coach']); return this.svc.uploadVideo(input);
  }

  @Mutation(() => CorrectiveVideoType)
  updateCorrectiveVideo(@Args('id') id:string, @Args('patch') patch: any, @Context() ctx:any){
    must(ctx, ['specialist','coach']); return this.svc.updateVideo(id, patch);
  }

  @Mutation(() => Boolean)
  approveCorrectiveVideo(@Args('id') id:string, @Args('status', { nullable:true }) status?: string, @Context() ctx:any){
    must(ctx, ['admin']); return this.svc.approveVideo(id, (status as any)||'APPROVED', { note: (patch as any)?.note, visibility: (patch as any)?.visibility, actorId: ctxUser(ctx)||undefined });
  }
}
