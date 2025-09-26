import { Roles } from '../auth/roles.decorator';
import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { MediaQueueService } from './mediaqueue.service';
import { EnqueueTranscodeInput, EnqueueImageInput } from './dto/enqueue.input';

@ObjectType()
class EnqueueResult {
  @Field() id: string;
  @Field() name: string;
}

@Resolver()
export class MediaQueueResolver {
  constructor(private readonly svc: MediaQueueService) {}

  @Mutation(() => EnqueueResult)
  enqueueTranscode(@Args('input') input: EnqueueTranscodeInput) {
    return this.svc.enqueueTranscode(input.inputUrl, input.outputKey, input.preset);
  }

  @Mutation(() => EnqueueResult)
  enqueueImage(@Args('input') input: EnqueueImageInput) {
    return this.svc.enqueueImage(input.inputUrl, input.outputKey, input.format, input.width);
  }
}
