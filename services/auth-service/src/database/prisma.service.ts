import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { timingMiddleware } from './prisma-middleware';

/**
 * PrismaService encapsulates the Prisma client for the auth
 * microservice. It manages the lifecycle of the database connection.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(){ this.$use(timingMiddleware()); await this.$connect(); }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}