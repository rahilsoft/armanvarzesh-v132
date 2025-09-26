
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { StorageService } from './storage.service';

@Resolver()
export class StorageResolver {
  constructor(private readonly svc: StorageService){}
  @Mutation(()=> String)
  async requestUploadUrl(@Args('folder') folder:string, @Args('contentType') contentType:string): Promise<string>{
    const res = await this.svc.presignPut(folder, contentType);
    return JSON.stringify(res);
  }
}
