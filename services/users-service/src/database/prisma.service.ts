import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { timingMiddleware } from './prisma-middleware';

/**
 * PrismaService encapsulates the PrismaClient and manages the
 * database connection lifecycle within the users microservice. It
 * ensures that a single client instance is used throughout the app
 * and that connections are properly opened and closed when modules
 * are initialized or destroyed.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(){ this.$use(timingMiddleware()); await this.$connect(); }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}