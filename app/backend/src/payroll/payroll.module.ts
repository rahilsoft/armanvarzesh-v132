
import { Module } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { PayrollResolver } from './payroll.resolver';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [PayrollService, PayrollResolver, PrismaService],
  exports: [PayrollService]
})
export class PayrollModule {}
