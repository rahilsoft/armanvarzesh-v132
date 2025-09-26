import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, Query, UseInterceptors, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { API_ROUTES } from '../../common/http/routes';
import { PaymentsUseCase } from '../../lib/domain';
import { CreatePaymentDto, ListPaymentsQuery } from '../dto/payments.dto';
import { SanitizePipe } from '../../common/security/sanitize.pipe';
import { AuthGuard } from '@nestjs/passport';
import { CacheControlInterceptor, cacheControl } from '../../common/http/cache-control.interceptor';

/** REST Payments endpoints */
@Controller()
export class PaymentsController {
  constructor(private readonly payments: PaymentsUseCase) {}

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Post(API_ROUTES.PAYMENTS.ROOT)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  async create(
    @Headers('idempotency-key') idemKey: string | undefined,
    @Body() dto: CreatePaymentDto,
    @Req() req: any,
  ) {
    // کاربر از JWT استخراج می‌شود
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('unauthenticated', HttpStatus.UNAUTHORIZED);
    }
    return this.payments.create({
      userId: userId,
      amountCents: dto.amountCents,
      currency: dto.currency,
      idempotencyKey: idemKey || dto.idempotencyKey,
    });
  }

/** @deprecated AUTO-MARKED (Stage17): Unused route per Stage 06 census. Keep until cleanup. */
  @Get(API_ROUTES.PAYMENTS.ROOT)
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CacheControlInterceptor)
  @cacheControl('private, max-age=15, stale-while-revalidate=30')
  @UsePipes(new SanitizePipe(), new ValidationPipe({ whitelist: true, transform: true }))
  async list(
    @Query() q: ListPaymentsQuery,
    @Req() req: any,
  ) {
    // کاربر از JWT استخراج می‌شود
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpException('unauthenticated', HttpStatus.UNAUTHORIZED);
    }
    const limit = q.limit ?? 20;
    return this.payments.listByUser(userId, limit, q.cursor);
  }
}