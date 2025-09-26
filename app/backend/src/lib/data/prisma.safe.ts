/**
 * SafePrismaService
 * Thin wrapper around PrismaClient to provide a single shared instance,
 * graceful shutdown, and a couple of helpers for raw SQL composition.
 */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class SafePrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.PRISMA_LOG?.split(',').map((l) => l.trim()) as any || ['warn', 'error'],
    });
  }
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }

  /** Expose Prisma.sql for safe raw fragments (tagged template). */
  get sql() { return Prisma.sql; }
  get join() { return Prisma.join; }
}
