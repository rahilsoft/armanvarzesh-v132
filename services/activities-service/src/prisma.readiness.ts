import { Injectable } from '@nestjs/common';
import { getPrisma } from './prisma';

@Injectable()
export class PrismaReadiness {
  private prisma = getPrisma();
  async ping(): Promise<boolean> {
    try {
      // SELECT 1; if DB is reachable, it should succeed
      await (this.prisma as any).$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
