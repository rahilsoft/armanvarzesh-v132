import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  OnModuleInit,
  Post,
  Query,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthPrincipal, CurrentUser } from '../common/auth/current-user.decorator';
import { MAX_PAYMENT_AMOUNT_RIAL, MIN_PAYMENT_AMOUNT_RIAL } from './dto/amount-bounds';
import { PaymentsService } from './payments.service';
import { PaymentVerification } from './providers/payment.provider';

/** Body of a Zarinpal payment request. The payer is never part of the body. */
export class ZarinpalRequestDto {
  /** Amount in Rial, as Zarinpal expects. */
  @IsInt()
  @Min(MIN_PAYMENT_AMOUNT_RIAL)
  @Max(MAX_PAYMENT_AMOUNT_RIAL)
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

function isDevOrTest(env: string | undefined = process.env.NODE_ENV): boolean {
  return env === 'development' || env === 'test';
}

/**
 * Result page the browser is redirected to after the Zarinpal callback. Read only from
 * env `PAYMENT_RESULT_URL` (never from the request, so no open redirect). Outside
 * NODE_ENV development/test it is required and must be an absolute https URL. In
 * development/test an http URL is accepted and an unset value returns null (the
 * callback then answers with JSON).
 */
export function resolvePaymentResultUrl(): URL | null {
  const raw = (process.env.PAYMENT_RESULT_URL || '').trim();
  const strict = !isDevOrTest();
  if (!raw) {
    if (strict) {
      throw new Error('PAYMENT_RESULT_URL is required outside development/test (absolute https URL of the payment result page)');
    }
    return null;
  }
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('PAYMENT_RESULT_URL must be an absolute URL');
  }
  const allowed = strict ? ['https:'] : ['https:', 'http:'];
  if (!allowed.includes(url.protocol)) {
    throw new Error(strict ? 'PAYMENT_RESULT_URL must use https' : 'PAYMENT_RESULT_URL must use http or https');
  }
  url.hash = '';
  return url;
}

export type PaymentResultStatus = 'success' | 'failed' | 'cancelled';

export function paymentResultStatus(res: PaymentVerification): PaymentResultStatus {
  if (res.ok) return 'success';
  return res.reason === 'cancelled' ? 'cancelled' : 'failed';
}

/** Builds the redirect target: the env URL plus status, ref and authority (no error text). */
export function buildPaymentResultUrl(base: URL, status: PaymentResultStatus, ref: string, authority: string): string {
  const target = new URL(base.toString());
  const query =
    `status=${encodeURIComponent(status)}` +
    `&ref=${encodeURIComponent(ref)}` +
    `&authority=${encodeURIComponent(authority)}`;
  target.search = target.search ? `${target.search}&${query}` : `?${query}`;
  return target.toString();
}

function wantsJson(req: Request): boolean {
  const accept = String(req?.headers?.accept || '').toLowerCase();
  return accept.includes('application/json') && !accept.includes('text/html');
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
 *   one, unknown authorities are rejected, a missing Status is rejected, Status=NOK moves
 *   a pending row to failed (never a paid one) and a paid authority is never credited
 *   twice (PaymentStore.markPaid is conditional). The browser gets a 302 to
 *   PAYMENT_RESULT_URL. App clients that send `Accept: application/json` get JSON.
 */
@Controller('payments/zarinpal')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
export class ZarinpalPaymentsController implements OnModuleInit {
  constructor(private readonly payments: PaymentsService) {}

  /** Fail fast at startup when the result page is missing or invalid outside dev/test. */
  onModuleInit(): void {
    resolvePaymentResultUrl();
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
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
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async callback(
    @Query('Authority') authority: string | undefined,
    @Query('Status') status: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const auth = typeof authority === 'string' ? authority : '';
    // A missing Status is forwarded as '' and rejected, never defaulted to OK.
    const st = typeof status === 'string' ? status : '';
    const out = await this.payments.verifyDetailed(auth, undefined, st);
    const resultStatus = paymentResultStatus(out);
    const ref = out.ok ? String(out.reference ?? '') : '';

    const base = resolvePaymentResultUrl();
    if (!base || wantsJson(req)) {
      res.status(HttpStatus.OK).json({
        success: out.ok,
        status: resultStatus,
        authority: auth || null,
        reference: out.ok ? out.reference ?? null : null,
        alreadyPaid: out.ok ? Boolean(out.alreadyPaid) : false,
        reason: out.ok ? null : out.reason ?? 'gateway_rejected',
      });
      return;
    }
    res.redirect(HttpStatus.FOUND, buildPaymentResultUrl(base, resultStatus, ref, auth));
  }
}
