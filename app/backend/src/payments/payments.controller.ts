import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { SanitizePipe } from '../common/security/sanitize.pipe';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments') // see API_ROUTES.payments
@UseGuards(JwtAuthGuard)
@UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePaymentDto, @Headers('Idempotency-Key') idem?: string) {
    const res = await (this.payments as any).create({ ...body, idempotencyKey: body.idempotencyKey || idem || undefined });
    return { ok: true, data: res };
  }

  @Get()
/** @deprecated AUTO-MARKED (Stage19): GQL op 'cursor' is unused per Stage 07 census. */
  @HttpCode(HttpStatus.OK)
  async listMine(@Query() q: ListPaymentsDto, @Req() req: any) {
    // شناسه کاربر از JwtAuthGuard استخراج می‌شود؛ fallback وجود ندارد
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