/**
 * Real Zarinpal v4 REST client.
 * Env: ZARINPAL_MERCHANT_ID (required), ZARINPAL_SANDBOX ('true' -> sandbox host),
 * ZARINPAL_CALLBACK_URL (required for requestPayment unless a callback is passed).
 */
export interface ZarinpalRequestResult {
  Status: number;
  Authority: string;
  paymentUrl: string;
}
export interface ZarinpalVerifyResult {
  Status: number;
  RefID: string | number | undefined;
  raw?: any;
}

export function zarinpalHost(): string {
  return process.env.ZARINPAL_SANDBOX === 'true' ? 'sandbox.zarinpal.com' : 'payment.zarinpal.com';
}

export function zarinpalStartPayUrl(authority: string): string {
  return `https://${zarinpalHost()}/pg/StartPay/${authority}`;
}

export function requireMerchantId(): string {
  const id = process.env.ZARINPAL_MERCHANT_ID;
  if (!id || !id.trim()) {
    throw new Error('ZARINPAL_MERCHANT_ID is required for Zarinpal payments but is not set');
  }
  return id.trim();
}

/**
 * Error raised for Zarinpal calls. `retryable` is true only for transport failures
 * (network error, timeout, HTTP 5xx). Gateway business rejections (e.g. code -51)
 * are not retryable and must not trip the circuit breaker.
 */
export class ZarinpalGatewayError extends Error {
  constructor(message: string, readonly retryable: boolean, readonly code?: string) {
    super(message);
    this.name = 'ZarinpalGatewayError';
  }
}

export function isRetryableGatewayError(e: unknown): boolean {
  if (e instanceof ZarinpalGatewayError) return e.retryable;
  // Unknown errors (programming/transport) keep the conservative retry behaviour.
  return true;
}

export function zarinpalTimeoutMs(): number {
  const n = Number(process.env.ZARINPAL_TIMEOUT_MS);
  return Number.isFinite(n) && n > 0 ? n : 10000;
}

async function post(path: string, body: Record<string, any>): Promise<any> {
  const timeoutMs = zarinpalTimeoutMs();
  const controller = new AbortController();
  // One deadline covers connect, headers and the full body. A provider that sends
  // headers and then stalls the body must not hold the request past the deadline.
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res: Response;
    try {
      res = await fetch(`https://${zarinpalHost()}/pg/v4/payment/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      throw transportError(error, controller, timeoutMs);
    }
    let json: any = null;
    try {
      json = await res.json();
    } catch (error) {
      // Abort during the body read is a timeout. Any other parse failure leaves json null.
      if (controller.signal.aborted) throw transportError(error, controller, timeoutMs);
      json = null;
    }
    if (!res.ok) {
      if (res.status >= 500) throw new ZarinpalGatewayError('HTTP ' + res.status, true);
      throw new ZarinpalGatewayError('HTTP ' + res.status + ' code ' + errorCode(json), false, errorCode(json));
    }
    if (json === null || typeof json !== 'object') {
      // A 2xx with an unreadable body is a transport fault, never a settled payment.
      throw new ZarinpalGatewayError('malformed response body', true);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

function transportError(error: unknown, controller: AbortController, timeoutMs: number): ZarinpalGatewayError {
  const aborted = (error as any)?.name === 'AbortError' || controller.signal.aborted;
  return new ZarinpalGatewayError(aborted ? 'timeout after ' + timeoutMs + 'ms' : (error as any)?.message || 'network error', true);
}

function errorCode(json: any): string {
  const err = json?.errors;
  if (err && !Array.isArray(err) && err.code !== undefined) return String(err.code);
  if (Array.isArray(err) && err[0]?.code !== undefined) return String(err[0].code);
  return String(json?.data?.code ?? 'unknown');
}

export class ZarinpalService {
  async requestPayment(
    amount: number,
    description: string,
    callbackUrl: string | undefined = process.env.ZARINPAL_CALLBACK_URL,
  ): Promise<ZarinpalRequestResult> {
    const merchantId = requireMerchantId();
    if (!callbackUrl) throw new Error('ZARINPAL_CALLBACK_URL is required for Zarinpal payment requests');
    let json: any;
    try {
      json = await post('request.json', {
        merchant_id: merchantId,
        amount,
        description,
        callback_url: callbackUrl,
      });
    } catch (error) {
      const retryable = isRetryableGatewayError(error);
      throw new ZarinpalGatewayError('Zarinpal request failed: ' + ((error as any)?.message || 'unknown error'), retryable, (error as any)?.code);
    }
    const data = json?.data;
    if (data && Number(data.code) === 100 && data.authority) {
      return { Status: 100, Authority: String(data.authority), paymentUrl: zarinpalStartPayUrl(String(data.authority)) };
    }
    throw new ZarinpalGatewayError('Zarinpal request failed: code ' + errorCode(json), false, errorCode(json));
  }

  async verifyPayment(authority: string, amount: number): Promise<ZarinpalVerifyResult> {
    const merchantId = requireMerchantId();
    let json: any;
    try {
      json = await post('verify.json', { merchant_id: merchantId, amount, authority });
    } catch (error) {
      const retryable = isRetryableGatewayError(error);
      throw new ZarinpalGatewayError('Zarinpal verification failed: ' + ((error as any)?.message || 'unknown error'), retryable, (error as any)?.code);
    }
    const data = json?.data;
    const code = Number(data?.code);
    if (data && (code === 100 || code === 101)) {
      return { Status: 100, RefID: data.ref_id, raw: data };
    }
    throw new ZarinpalGatewayError('Zarinpal verification failed: code ' + errorCode(json), false, errorCode(json));
  }
}
