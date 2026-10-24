import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { SanitizePipe } from '../common/security/sanitize.pipe';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments') // see API_ROUTES.payments
@UseGuards(JwtAuthGuard)
@UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  // POST /payments was retired (REV-20261021-07): it wrote to a legacy `payments` table that
  // no migration creates, so it could only fail. Payments start at POST /payments/zarinpal/request.

  @Get()
/** @deprecated AUTO-MARKED (Stage19): GQL op 'cursor' is unused per Stage 07 census. */
  @HttpCode(HttpStatus.OK)
  async listMine(@Query() q: ListPaymentsDto, @Req() req: any) {
    // شناسه کاربر از JwtAuthGuard استخراج می‌شود، fallback وجود ندارد
    const userId: string | undefined = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('unauthenticated');
    }
    const limit = Number(q?.limit || 20);
    const cursor = q?.cursor;
    const out = await this.payments.listByUser({ userId, limit, cursor });
    return { ok: true, data: out.items, nextCursor: out.nextCursor };
  }
}