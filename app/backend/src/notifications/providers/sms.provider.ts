import { withBackoff, CircuitBreaker } from '../../common/retry/circuitBreaker';

export interface SmsProvider {
  send(to: string, body: string): Promise<void>;
}

export function makeSmsProvider(): SmsProvider {
  const provider = (process.env.SMS_PROVIDER || 'mock').toLowerCase();
  switch (provider) {
    case 'kavenegar': return new KavenegarProvider(process.env.KAVENEGAR_API_KEY || '');
    case 'twilio': return new TwilioProvider(process.env.TWILIO_ACCOUNT_SID || '', process.env.TWILIO_AUTH_TOKEN || '', process.env.TWILIO_FROM || '');
    default: return new MockSmsProvider();
  }
}

class MockSmsProvider implements SmsProvider {
  async send(to: string, body: string) { console.log('[SMS:MOCK]', to, body); }
}

class KavenegarProvider implements SmsProvider {
  private breaker = new CircuitBreaker(5, 5000);
  constructor(private apiKey: string) {}
  async send(to: string, body: string) {
    if (!this.apiKey) throw new Error('KAVENEGAR_API_KEY missing');
    await this.breaker.exec(() => withBackoff(async () => {
      try {
        const mod: any = await import('kavenegar');
        const api = mod.KavenegarApi({ apikey: this.apiKey });
        // NOTE: SDK calling style may vary; here we show a placeholder
        await new Promise<void>((resolve, reject) => {
          api.Send({ sender: '10004346', receptor: to, message: body }, function(response: any, status: any) {
            if (status === 200) resolve(); else reject(new Error('Kavenegar status ' + status));
          });
        });
      } catch (e) {
        if (process.env.APP_ENV !== 'production') {
          console.log('[SMS:KAVENEGAR:FALLBACK]', to, body);
          return;
        }
        throw e;
      }
    }));
  }
}

class TwilioProvider implements SmsProvider {
  private breaker = new CircuitBreaker(5, 5000);
  constructor(private sid: string, private token: string, private from: string) {}
  async send(to: string, body: string) {
    if (!this.sid || !this.token || !this.from) throw new Error('Twilio credentials missing');
    await this.breaker.exec(() => withBackoff(async () => {
      try {
        const twilio: any = await import('twilio');
        const client = (twilio as any).default ? (twilio as any).default(this.sid, this.token) : (twilio as any)(this.sid, this.token);
        await client.messages.create({ from: this.from, to, body });
      } catch (e) {
        if (process.env.APP_ENV !== 'production') {
          console.log('[SMS:TWILIO:FALLBACK]', this.from, '->', to, body);
          return;
        }
        throw e;
      }
    }));
  }
}
