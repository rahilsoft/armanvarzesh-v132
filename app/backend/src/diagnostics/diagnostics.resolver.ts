import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';
import { createDbContext, dbPing, createQueueContext } from '@arman/integration';

@ObjectType()
class Diagnostics {
  @Field()
  db!: boolean;
  @Field()
  queue!: boolean;
}

@Resolver(() => Diagnostics)
export class DiagnosticsResolver {
  @Query(() => Diagnostics)
  async diagnostics(): Promise<Diagnostics> {
    const dbCtx = createDbContext(process.env);
    const dbOk = await dbPing(dbCtx);
    const qCtx = createQueueContext('backend', process.env);
    return { db: dbOk, queue: qCtx.ready };
  }
}
