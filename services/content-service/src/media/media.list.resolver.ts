
import { Resolver, Query } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Resolver()
export class MediaListResolver {
  @Query(()=> String)
  async mediaJobs(): Promise<string>{
    const rows = await prisma.mediaJob.findMany({ orderBy:{ createdAt: 'desc' }, take: 50 });
    return JSON.stringify(rows);
  }
}
