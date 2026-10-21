import { ExpoPushProvider, EXPO_PUSH_URL } from '../providers/expo-push.provider';
import { makeSmsProvider } from '../providers/sms.provider';

const realFetch = global.fetch;
const env = { ...process.env };
let fetchMock: jest.Mock;

const jsonRes = (status: number, body: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as unknown as Response;

beforeEach(() => {
  fetchMock = jest.fn();
  (global as any).fetch = fetchMock;
});
afterEach(() => {
  (global as any).fetch = realFetch;
  process.env = { ...env };
});

describe('ExpoPushProvider', () => {
  const tok = (n: number) => `ExponentPushToken[abc${n}]`;

  it('posts to Expo with bearer token and parses tickets', async () => {
    process.env.EXPO_ACCESS_TOKEN = 'expo-secret';
    fetchMock.mockResolvedValue(
      jsonRes(200, { data: [{ status: 'ok', id: 't1' }, { status: 'error', details: { error: 'DeviceNotRegistered' } }] }),
    );
    const res = await new ExpoPushProvider().sendMany({ title: 'hi', body: 'b' }, [tok(1), tok(2)]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(EXPO_PUSH_URL);
    expect(init.method).toBe('POST');
    expect(init.headers.authorization).toBe('Bearer expo-secret');
    expect(JSON.parse(init.body)).toHaveLength(2);
    expect(res[0]).toMatchObject({ ok: true, ticketId: 't1' });
    expect(res[1]).toMatchObject({ ok: false, error: 'DeviceNotRegistered', invalidToken: true });
  });

  it('omits authorization without EXPO_ACCESS_TOKEN', async () => {
    delete process.env.EXPO_ACCESS_TOKEN;
    fetchMock.mockResolvedValue(jsonRes(200, { data: [{ status: 'ok', id: 'x' }] }));
    await new ExpoPushProvider().sendMany({ title: 't', body: 'b' }, [tok(1)]);
    expect(fetchMock.mock.calls[0][1].headers.authorization).toBeUndefined();
  });

  it('batches in chunks of 100', async () => {
    fetchMock.mockImplementation(async (_u: string, init: any) =>
      jsonRes(200, { data: JSON.parse(init.body).map(() => ({ status: 'ok', id: 'i' })) }),
    );
    const tokens = Array.from({ length: 250 }, (_, i) => tok(i));
    const res = await new ExpoPushProvider().sendMany({ title: 't', body: 'b' }, tokens);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(res).toHaveLength(250);
    expect(res.every((r) => r.ok)).toBe(true);
  });

  it('rejects malformed tokens without calling Expo', async () => {
    const res = await new ExpoPushProvider().sendMany({ title: 't', body: 'b' }, ['fcm-raw-token']);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(res[0]).toMatchObject({ ok: false, error: 'InvalidExpoPushToken' });
  });

  it('marks all failed on HTTP error and network error', async () => {
    fetchMock.mockResolvedValueOnce(jsonRes(500, {}));
    let res = await new ExpoPushProvider().sendMany({ title: 't', body: 'b' }, [tok(1)]);
    expect(res[0]).toMatchObject({ ok: false, error: 'ExpoHttp500' });
    fetchMock.mockRejectedValueOnce(new TypeError('boom'));
    res = await new ExpoPushProvider().sendMany({ title: 't', body: 'b' }, [tok(1)]);
    expect(res[0].ok).toBe(false);
  });

  it('send() throws when not accepted', async () => {
    fetchMock.mockResolvedValue(jsonRes(200, { data: [{ status: 'error', details: { error: 'MessageTooBig' } }] }));
    await expect(new ExpoPushProvider().send({ title: 't', body: 'b' }, tok(1))).rejects.toThrow('MessageTooBig');
  });
});

describe('makeSmsProvider', () => {
  beforeEach(() => {
    delete process.env.SMS_PROVIDER;
    delete process.env.KAVENEGAR_API_KEY;
    delete process.env.KAVENEGAR_SENDER;
    delete process.env.KAVENEGAR_OTP_TEMPLATE;
  });

  it('fails fast in production without provider', () => {
    (process.env as any).NODE_ENV = 'production';
    expect(() => makeSmsProvider()).toThrow(/SMS_PROVIDER is required/);
  });

  it('fails fast for mock/console in production and unknown values', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.SMS_PROVIDER = 'console';
    expect(() => makeSmsProvider()).toThrow(/development\/test/);
    process.env.SMS_PROVIDER = 'mock';
    expect(() => makeSmsProvider()).toThrow(/Unknown/);
  });

  it('fails fast when Kavenegar key or sender missing', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.SMS_PROVIDER = 'kavenegar';
    expect(() => makeSmsProvider()).toThrow(/KAVENEGAR_API_KEY/);
    process.env.KAVENEGAR_API_KEY = 'k';
    expect(() => makeSmsProvider()).toThrow(/KAVENEGAR_SENDER/);
  });

  it('unset provider in test env refuses to send instead of faking success', async () => {
    (process.env as any).NODE_ENV = 'test';
    await expect(makeSmsProvider().send('0912', 'x')).rejects.toThrow(/not set/);
  });

  describe('kavenegar', () => {
    beforeEach(() => {
      (process.env as any).NODE_ENV = 'production';
      process.env.SMS_PROVIDER = 'kavenegar';
      process.env.KAVENEGAR_API_KEY = 'KEY123';
      process.env.KAVENEGAR_SENDER = '2000500666';
    });

    it('sends sms/send.json with form body', async () => {
      fetchMock.mockResolvedValue(jsonRes(200, { return: { status: 200 } }));
      await makeSmsProvider().send('09120000000', 'salam');
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://api.kavenegar.com/v1/KEY123/sms/send.json');
      const form = new URLSearchParams(init.body);
      expect(form.get('receptor')).toBe('09120000000');
      expect(form.get('sender')).toBe('2000500666');
      expect(form.get('message')).toBe('salam');
    });

    it('uses verify/lookup.json for OTP when template set', async () => {
      process.env.KAVENEGAR_OTP_TEMPLATE = 'otp';
      fetchMock.mockResolvedValue(jsonRes(200, { return: { status: 200 } }));
      await makeSmsProvider().sendOtp!('0912', '12345');
      expect(fetchMock.mock.calls[0][0]).toBe('https://api.kavenegar.com/v1/KEY123/verify/lookup.json');
      const form = new URLSearchParams(fetchMock.mock.calls[0][1].body);
      expect(form.get('template')).toBe('otp');
      expect(form.get('token')).toBe('12345');
    });

    it('throws on API error without leaking key, no retry on 4xx', async () => {
      fetchMock.mockResolvedValue(jsonRes(418, { return: { status: 418 } }));
      const err = await makeSmsProvider().send('0912', 'x').catch((e) => e);
      expect(err).toBeInstanceOf(Error);
      expect(String(err.message)).not.toContain('KEY123');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('does not leak key on network failure', async () => {
      fetchMock.mockRejectedValue(new Error('connect https://api.kavenegar.com/v1/KEY123/'));
      const err = await makeSmsProvider().send('0912', 'x').catch((e) => e);
      expect(String(err.message)).not.toContain('KEY123');
    }, 15000);
  });
});
