import { PrismaClient } from '@prisma/client';

// Single shared PrismaClient for the service (P0-6): per-module/per-request
// client instantiation exhausts the Postgres connection pool under load.
let _prisma: PrismaClient | undefined;
export function getPrisma(): PrismaClient {
  return (_prisma ??= new PrismaClient());
}
