import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../database/prisma.service';

/**
 * Module bundling the users resolver and service together. Provides the
 * PrismaService so that the service can access the database.
 */
@Module({
  providers: [PrismaService, UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}