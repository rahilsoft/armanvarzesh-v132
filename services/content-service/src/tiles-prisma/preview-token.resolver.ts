
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Roles } from '../security/roles.decorator';
import { signPreview } from '../security/preview.util';

@Resolver()
export class PreviewTokenResolver {
  @Roles('admin','editor')
  @Query(() => String)
  generatePreviewToken(@Args('page', { nullable: true }) page?: string, @Args('ttlSec', { nullable: true }) ttlSec?: number){
    const key = process.env.PREVIEW_SIGNING_KEY;
    if (!key) throw new Error('PREVIEW_SIGNING_KEY not set');
    const exp = Date.now() + (Math.max(60, ttlSec || 900) * 1000);
    return signPreview({ page: page || 'home', exp }, key);
  }
}
