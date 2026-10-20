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

async function post(path: string, body: Record<string, any>): Promise<any> {
  const res = await fetch(`https://${zarinpalHost()}/pg/v4/payment/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return json;
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
      throw new Error('Zarinpal request failed: ' + ((error as any)?.message || 'unknown error'));
    }
    const data = json?.data;
    if (data && Number(data.code) === 100 && data.authority) {
      return { Status: 100, Authority: String(data.authority), paymentUrl: zarinpalStartPayUrl(String(data.authority)) };
    }
    throw new Error('Zarinpal request failed: code ' + errorCode(json));
  }

  async verifyPayment(authority: string, amount: number): Promise<ZarinpalVerifyResult> {
    const merchantId = requireMerchantId();
    let json: any;
    try {
      json = await post('verify.json', { merchant_id: merchantId, amount, authority });
    } catch (error) {
      throw new Error('Zarinpal verification failed: ' + ((error as any)?.message || 'unknown error'));
    }
    const data = json?.data;
    const code = Number(data?.code);
    if (data && (code === 100 || code === 101)) {
      return { Status: 100, RefID: data.ref_id, raw: data };
    }
    throw new Error('Zarinpal verification failed: code ' + errorCode(json));
  }
}
