import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export abstract class BaseRepository {
  protected readonly logger = new Logger(this.constructor.name);

  protected mapError(e: any): Error {
    if (e && typeof e === 'object' && 'code' in e) {
      const code = (e as any).code as string;
      if (code === 'P2002') return new Error('Unique constraint violation');
      if (code === 'P2025') return new Error('Record not found');
    }
    return e instanceof Error ? e : new Error(String(e));
  }

  protected async safeCall<T>(task: () => Promise<T>, label = 'repo-call'): Promise<T> {
    try {
      return await task();
    } catch (e) {
      const err = this.mapError(e);
      this.logger.error(`${label} failed: ${err.message}`);
      throw err;
    }
  }
}
