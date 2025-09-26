import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaReadiness {
  private prisma = new PrismaClient();
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
