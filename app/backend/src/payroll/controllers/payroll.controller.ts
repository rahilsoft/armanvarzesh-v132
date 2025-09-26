
import { Controller, Get, Param } from '@nestjs/common';
import { PayrollService } from '../payroll.service';
import { Payroll } from '../entities/payroll.entity';

@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get()
  async findAll(): Promise<Payroll[]> {
    return this.payrollService.findAll();
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Payroll> {
    return this.payrollService.findOne(Number(id));
  }
}