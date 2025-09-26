
import { Args, Field, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';

@ObjectType()
class PublishAuditDTO {
  @Field() id: string;
  @Field() tileId: string;
  @Field({ nullable: true }) page?: string;
  @Field({ nullable: true }) variant?: string;
  @Field() action: string;
  @Field({ nullable: true }) actorId?: string;
  @Field({ nullable: true }) fromState?: string;
  @Field({ nullable: true }) toState?: string;
  @Field(() => String, { nullable: true }) snapshot?: string; // JSON stringified
  @Field() createdAt: Date;
}

@Resolver()
export class AuditResolver {
  private prisma = new PrismaClient();

  @Query(() => [PublishAuditDTO])
  async auditLogs(
    @Args('tileId', { nullable: true }) tileId?: string,
    @Args('page', { nullable: true }) page?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('cursor', { nullable: true }) cursor?: string
  ): Promise<PublishAuditDTO[]> {
    const take = Math.min(Math.max(limit || 50, 1), 200);
    const where: any = {};
    if (tileId) where.tileId = tileId;
    const logs = await this.prisma.publishAudit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { tile: true }
    });
    return logs.map((l: any) => ({
      id: l.id,
      tileId: l.tileId,
      page: l.tile?.page,
      variant: l.tile?.variant || undefined,
      action: l.action,
      actorId: l.actorId,
      fromState: l.fromState || undefined,
      toState: l.toState || undefined,
      snapshot: l.snapshot ? JSON.stringify(l.snapshot) : undefined,
      createdAt: l.createdAt
    }));
  }
}
