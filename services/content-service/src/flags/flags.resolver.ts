
import { Args, Field, ObjectType, Query, Resolver, Mutation } from '@nestjs/graphql';
import { FlagsService } from './flags.service';
import { Roles } from '../security/roles.decorator';

@ObjectType()
class FeatureFlagDTO {
  @Field() key: string;
  @Field() value: boolean;
}

@Resolver()
export class FlagsResolver {
  private svc = new FlagsService();
  @Query(() => [FeatureFlagDTO])
  async featureFlags(){
    const map = await this.svc.list();
    return Object.keys(map).map(k=> ({ key:k, value: !!map[k] }));
  }

  @Roles('admin','editor')
  @Mutation(() => Boolean)
  async setFeatureFlag(@Args('key') key: string, @Args('value') value: boolean, @Args('actorId', { nullable: true }) actorId?: string, @Args('description', { nullable: true }) description?: string){
    return this.svc.set(key, value, actorId, description);
  }
}
