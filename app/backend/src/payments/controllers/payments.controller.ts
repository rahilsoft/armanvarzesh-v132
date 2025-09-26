import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { Payment } from '../entities/payment.entity';

/** PaymentsController
 *  Exposes REST endpoints for listing and verifying payments.
 */
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.findOne(id);
  }
/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
/** @deprecated AUTO-MARKED (Stage19): GQL op 'Authority' is unused per Stage 07 census. */
/** @deprecated AUTO-MARKED (Stage19): GQL op 'Amount' is unused per Stage 07 census. */

  @Get('verify/callback')
  async verifyCallback(@Query('Authority') authority: string, @Query('Amount') amount: string): Promise<{ success: boolean }> {
    const ok = await this.paymentsService.verify(authority, Number(amount));
    return { success: ok };
  }
}