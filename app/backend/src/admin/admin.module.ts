
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [AdminService, AdminResolver, PrismaService],
  exports: [AdminService]
})
export class AdminModule {}
