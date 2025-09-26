import { Roles } from '../auth/roles.decorator';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StorageService } from '../storage/storage.service';
import { CreateUploadUrlInput } from './dto/upload.input';
import { UploadUrl, DownloadUrl } from './entities/upload.entity';

@Resolver()
export class UploadsResolver {
  constructor(private readonly storage: StorageService) {}

  @Roles('user','coach','admin')
    @Mutation(() => UploadUrl)
  async createUploadUrl(@Args('input') input: CreateUploadUrlInput): Promise<UploadUrl> {
    return this.storage.createUploadUrl(input.key, input.contentType);
  }

  @Roles('user','coach','admin')
    @Query(() => DownloadUrl)
  async signedDownloadUrl(@Args('key') key: string): Promise<DownloadUrl> {
    return this.storage.createDownloadUrl(key);
  }
}
