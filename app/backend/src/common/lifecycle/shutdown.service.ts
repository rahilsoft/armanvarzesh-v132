import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private readonly log = new Logger('Shutdown');
  async onApplicationShutdown(signal?: string) {
    this.log.log(`Shutting down due to: ${signal || 'unknown'}`);
    try {
      // attempt to gracefully disconnect Prisma if available
      const anyGlobal: any = globalThis as any;
      const prisma: any = (anyGlobal.prisma) || null;
      if (prisma && typeof prisma.$disconnect === 'function') {
        await prisma.$disconnect();
        this.log.log('Prisma disconnected');
      }
    } catch (e) {
      this.log.error('Error during shutdown', (e as any)?.message);
    }
  }
}
