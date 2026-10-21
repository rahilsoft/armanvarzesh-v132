import { Injectable, Logger } from '@nestjs/common';

export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
export const EXPO_BATCH_SIZE = 100;

export type PushPayload = { title: string; body: string; data?: Record<string, unknown> };

export type PushResult = {
  token: string;
  ok: boolean;
  /** Expo error code such as DeviceNotRegistered, MessageTooBig, InvalidCredentials. */
  error?: string;
  /** Ticket id for later receipt lookup when accepted by Expo. */
  ticketId?: string;
  /** True when the token is permanently invalid and should be deleted. */
  invalidToken?: boolean;
};

export function isExpoPushToken(token: string): boolean {
  return /^(ExponentPushToken|ExpoPushToken)\[[^\]\s]+\]$/.test(token);
}

/**
 * Real Expo Push Service client. Uses global fetch; the optional
 * EXPO_ACCESS_TOKEN enables enhanced push security. Never logs bodies.
 */
@Injectable()
export class ExpoPushProvider {
  private readonly logger = new Logger(ExpoPushProvider.name);

  async sendMany(payload: PushPayload, tokens: string[]): Promise<PushResult[]> {
    const results: PushResult[] = [];
    const valid: string[] = [];
    for (const token of tokens) {
      if (isExpoPushToken(token)) valid.push(token);
      else results.push({ token, ok: false, error: 'InvalidExpoPushToken', invalidToken: true });
    }
    for (let i = 0; i < valid.length; i += EXPO_BATCH_SIZE) {
      results.push(...(await this.sendBatch(payload, valid.slice(i, i + EXPO_BATCH_SIZE))));
    }
    return results;
  }

  /** Single-token convenience; throws when Expo did not accept the message. */
  async send(payload: PushPayload, token: string): Promise<void> {
    const [res] = await this.sendMany(payload, [token]);
    if (!res.ok) throw new Error(`expo push rejected: ${res.error ?? 'unknown'}`);
  }

  private async sendBatch(payload: PushPayload, tokens: string[]): Promise<PushResult[]> {
    const headers: Record<string, string> = {
      accept: 'application/json',
      'content-type': 'application/json',
    };
    const access = process.env.EXPO_ACCESS_TOKEN;
    if (access) headers.authorization = `Bearer ${access}`;

    const messages = tokens.map((to) => ({
      to,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      sound: 'default',
    }));

    let res: Response;
    try {
      res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(messages),
        signal: AbortSignal.timeout(15000),
      });
    } catch (e) {
      const reason = `ExpoRequestFailed:${(e as Error)?.name ?? 'Error'}`;
      this.logger.error(`expo push request failed: ${reason}`);
      return tokens.map((token) => ({ token, ok: false, error: reason }));
    }

    let json: any;
    try {
      json = await res.json();
    } catch {
      json = undefined;
    }
    if (!res.ok || !json) {
      const reason = `ExpoHttp${res.status}`;
      this.logger.error(`expo push http error: ${reason}`);
      return tokens.map((token) => ({ token, ok: false, error: reason }));
    }
    const tickets: any[] = Array.isArray(json.data) ? json.data : [];
    if (tickets.length !== tokens.length) {
      const reason = json.errors?.[0]?.code ? `Expo:${json.errors[0].code}` : 'ExpoMalformedResponse';
      return tokens.map((token) => ({ token, ok: false, error: reason }));
    }
    return tokens.map((token, idx) => {
      const t = tickets[idx];
      if (t?.status === 'ok') return { token, ok: true, ticketId: t.id };
      const code: string = t?.details?.error ?? 'ExpoTicketError';
      return { token, ok: false, error: code, invalidToken: code === 'DeviceNotRegistered' };
    });
  }
}
