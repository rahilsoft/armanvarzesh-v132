import { MediaListResolver } from './media.list.resolver';

import { Module } from '@nestjs/common';
import { MediaResolver } from './media.resolver';

@Module({
  providers:[MediaResolver, MediaListResolver]
})
export class MediaModule {}
