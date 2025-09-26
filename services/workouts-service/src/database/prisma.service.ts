import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { timingMiddleware } from './prisma-middleware';

/**
 * Prisma service for the workouts microservice. Handles database
 * connection lifecycle.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(){ this.$use(timingMiddleware()); await this.$connect(); }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}