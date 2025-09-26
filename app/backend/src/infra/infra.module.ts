import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

// فرض می‌کنیم کلاس‌های سرویس موجودند
export class OutboxService {
  async emit(_: any) { /* no-op placeholder; جایگزین با منطق واقعی */ }
}
export class IdempotencyService {
  async runOnce(_: string, __: string, fn: () => Promise<any>) { return fn(); }
}

@Module({
  providers: [
    PrismaService,
    { provide: OutboxService, useClass: OutboxService },
    { provide: IdempotencyService, useClass: IdempotencyService }
  ],
  exports: [PrismaService, OutboxService, IdempotencyService]
})
export class InfraModule {}
