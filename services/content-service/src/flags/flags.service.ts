
import { PrismaClient } from '@prisma/client';

export class FlagsService {
  private prisma = new PrismaClient();
  async list(){
    const envJson = process.env.FEATURE_FLAGS_JSON;
    let envFlags: Record<string, boolean> = {};
    if (envJson){ try{ envFlags = JSON.parse(envJson); }catch{} }
    const rows = await this.prisma.featureFlag.findMany();
    const dbFlags = rows.reduce((acc:any, r:any)=> (acc[r.key]=r.value, acc), {});
    return { ...envFlags, ...dbFlags };
  }
  async set(key: string, value: boolean, actorId?: string, description?: string){
    await this.prisma.featureFlag.upsert({
      where: { key },
      update: { value, updatedBy: actorId, description },
      create: { key, value, updatedBy: actorId, description }
    });
    return true;
  }
}
