
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { PushProvider } from './push.provider';

const prisma = new PrismaClient();
const provider = new PushProvider();

@Resolver()
export class PushResolver {
  @Mutation(()=> String)
  async registerDeviceToken(@Args('userId') userId:string, @Args('platform') platform:string, @Args('token') token:string, @Args('enabled',{nullable:true}) enabled?:boolean): Promise<string>{
    const exists = await prisma.deviceToken.findUnique({ where:{ token } });
    let row;
    if (exists) row = await prisma.deviceToken.update({ where:{ token }, data:{ userId, platform, enabled: enabled ?? true, lastSeenAt: new Date() } });
    else row = await prisma.deviceToken.create({ data:{ userId, platform, token, enabled: enabled ?? true } });
    return JSON.stringify(row);
  }

  @Mutation(()=> String)
  async sendTestPush(@Args('userId') userId:string, @Args('title') title:string, @Args('body') body:string): Promise<string>{
    const res = await provider.sendToUser(userId, { title, body });
    return JSON.stringify(res);
  }

  @Query(()=> String)
  async listDeviceTokens(@Args('userId') userId:string): Promise<string>{
    const rows = await prisma.deviceToken.findMany({ where:{ userId }, orderBy:{ updatedAt: 'desc' } });
    return JSON.stringify(rows);
  }
}
