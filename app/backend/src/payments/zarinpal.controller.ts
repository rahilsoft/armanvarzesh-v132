import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ServiceUnavailableException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthPrincipal, CurrentUser } from '../common/auth/current-user.decorator';
import { PaymentsService } from './payments.service';

/** Body of a Zarinpal payment request. The payer is never part of the body. */
export class ZarinpalRequestDto {
  /** Amount in Rial, as Zarinpal expects. */
  @IsInt()
  @Min(1000)
  @Max(2_000_000_000)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

/** Server-side callback URL Zarinpal redirects to. Never taken from the client. */
export function requireZarinpalCallbackUrl(): string {
  const url = (process.env.ZARINPAL_CALLBACK_URL || '').trim();
  if (!url) {
    throw new ServiceUnavailableException('ZARINPAL_CALLBACK_URL is required for Zarinpal payment requests but is not set');
  }
  return url;
}

/**
 * Zarinpal payment routes.
 *
 * - `POST /payments/zarinpal/request` is JWT-protected. The payer id comes only from
 *   the verified access token (`@CurrentUser`), never from body, headers or query. The
 *   pending row (authority + amount + userId) is persisted before the redirect URL is
 *   returned, so the callback verifies against the stored amount.
 * - `GET /payments/zarinpal/callback` is the browser redirect from Zarinpal. It carries
 *   no bearer token (the user returns from the gateway), so it is public. It is safe
 *   because it never trusts the query: the amount sent to Zarinpal verify is the stored
 *   one, unknown authorities are rejected, a missing or non-OK Status is rejected and a
 *   paid authority is never credited twice (PaymentStore.markPaid is conditional).
 */
@Controller('payments/zarinpal')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class ZarinpalPaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async request(@CurrentUser() user: AuthPrincipal, @Body() dto: ZarinpalRequestDto) {
    const callbackUrl = requireZarinpalCallbackUrl();
    const out = await this.payments.requestPayment({
      amount: dto.amount,
      callbackUrl,
      userId: user.userId,
      description: dto.description,
    });
    return { ok: true, data: out };
  }

  @Get('callback')
  @HttpCode(HttpStatus.OK)
  async callback(@Query('Authority') authority?: string, @Query('Status') status?: string) {
    const auth = typeof authority === 'string' ? authority : '';
    // A missing Status is forwarded as '' and rejected, never defaulted to OK.
    const st = typeof status === 'string' ? status : '';
    const res = await this.payments.verifyDetailed(auth, undefined, st);
    return {
      success: res.ok,
      authority: auth || null,
      reference: res.ok ? res.reference ?? null : null,
      alreadyPaid: res.ok ? Boolean(res.alreadyPaid) : false,
      reason: res.ok ? null : res.reason ?? 'gateway_rejected',
    };
  }
}
