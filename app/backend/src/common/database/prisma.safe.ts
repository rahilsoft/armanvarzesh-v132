import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/** SafePrismaService provides safer helpers around raw SQL and transactions. */
@Injectable()
export class SafePrismaService extends PrismaClient {
  private readonly logger = new Logger(SafePrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'production' ? [] : ['error','warn'],
    });
  }

  /** Only allow parameterized $executeRaw via Prisma.sql to avoid SQLi. */
  async exec(sql: Prisma.Sql): Promise<number> {
    try {
      // @ts-expect-error types align at runtime
      return await this.$executeRaw(sql);
    } catch (e: any) {
      this.logger.error(`$executeRaw failed: ${e?.message || e}`);
      throw e;
    }
  }

  /** Only allow parameterized $queryRaw via Prisma.sql to avoid SQLi. */
  async query<T = unknown>(sql: Prisma.Sql): Promise<T> {
    try {
      // @ts-expect-error types align at runtime
      return await this.$queryRaw<T>(sql);
    } catch (e: any) {
      this.logger.error(`$queryRaw failed: ${e?.message || e}`);
      throw e;
    }
  }

  /** Run a function within a transaction. */
  async tx<T>(fn: (tx: Omit<this, "$connect" | "$disconnect">) => Promise<T>): Promise<T> {
    // @ts-ignore PrismaClient is structurally typed
    return await this.$transaction(async (tx) => fn(tx as any));
  }
}
