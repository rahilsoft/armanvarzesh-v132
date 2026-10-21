import { withBackoff, CircuitBreaker } from '../../common/retry/circuitBreaker';

export interface SmsProvider {
  send(to: string, body: string): Promise<void>;
  /** OTP via provider template (Kavenegar verify/lookup). */
  sendOtp?(to: string, code: string): Promise<void>;
}

const isDevOrTest = () => process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

/** Builds the SMS provider from env. Outside development/test a missing provider or key throws. */
export function makeSmsProvider(): SmsProvider {
  const raw = (process.env.SMS_PROVIDER || '').toLowerCase();
  if (!raw) {
    if (isDevOrTest()) return new UnconfiguredSmsProvider();
    throw new Error('SMS_PROVIDER is required (kavenegar|twilio) outside development/test');
  }
  switch (raw) {
    case 'kavenegar':
      return new KavenegarProvider(process.env.KAVENEGAR_API_KEY, process.env.KAVENEGAR_SENDER, process.env.KAVENEGAR_OTP_TEMPLATE);
    case 'twilio':
      return new TwilioProvider(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_FROM);
    case 'console':
      if (!isDevOrTest()) throw new Error('SMS_PROVIDER=console is only allowed in development/test');
      return new ConsoleSmsProvider();
    default:
      throw new Error(`Unknown SMS_PROVIDER "${raw}"`);
  }
}

class UnconfiguredSmsProvider implements SmsProvider {
  async send(): Promise<void> {
    throw new Error('SMS_PROVIDER is not set; SMS not sent');
  }
}

/** Dev/test only. Logs the masked receptor and body length, never the body. */
class ConsoleSmsProvider implements SmsProvider {
  async send(to: string, body: string): Promise<void> {
    console.log(`[SMS:console] to=***${to.slice(-4)} len=${body.length}`);
  }
}

export class KavenegarProvider implements SmsProvider {
  private breaker = new CircuitBreaker(5, 5000);
  constructor(private apiKey?: string, private sender?: string, private otpTemplate?: string) {
    if (!apiKey) throw new Error('KAVENEGAR_API_KEY is required when SMS_PROVIDER=kavenegar');
    if (!sender) throw new Error('KAVENEGAR_SENDER is required when SMS_PROVIDER=kavenegar');
  }

  async send(to: string, body: string): Promise<void> {
    await this.call('sms/send.json', { receptor: to, sender: this.sender!, message: body });
  }

  async sendOtp(to: string, code: string): Promise<void> {
    if (!this.otpTemplate) {
      // No template configured: send as a plain SMS through the same real API.
      return this.send(to, code);
    }
    await this.call('verify/lookup.json', { receptor: to, token: code, template: this.otpTemplate });
  }

  private async call(path: string, params: Record<string, string>): Promise<void> {
    const url = `https://api.kavenegar.com/v1/${encodeURIComponent(this.apiKey!)}/${path}`;
    // Permanent (4xx) failures are returned, not thrown, so they are not retried.
    const outcome = await this.breaker.exec(() =>
      withBackoff(async (): Promise<string | null> => {
        let res: Response;
        try {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
            body: new URLSearchParams(params).toString(),
            signal: AbortSignal.timeout(10000),
          });
        } catch (e) {
          // never include the URL (it contains the API key)
          throw new Error(`Kavenegar request failed: ${(e as Error)?.name ?? 'Error'}`);
        }
        let json: any;
        try { json = await res.json(); } catch { json = undefined; }
        const status = json?.return?.status ?? res.status;
        if (res.ok && status === 200) return null;
        const msg = `Kavenegar error status=${status}`;
        if (res.status >= 500 || res.status === 429) throw new Error(msg);
        return msg;
      }, { retries: 2 }),
    );
    if (outcome) throw new Error(outcome);
  }
}

export class TwilioProvider implements SmsProvider {
  private breaker = new CircuitBreaker(5, 5000);
  constructor(private sid?: string, private token?: string, private from?: string) {
    if (!sid || !token || !from) throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM are required when SMS_PROVIDER=twilio');
  }
  async send(to: string, body: string): Promise<void> {
    await this.breaker.exec(() => withBackoff(async () => {
      const twilio: any = await import('twilio');
      const factory = twilio.default ?? twilio;
      const client = factory(this.sid, this.token);
      await client.messages.create({ from: this.from, to, body });
    }, { retries: 2 }));
  }
}
