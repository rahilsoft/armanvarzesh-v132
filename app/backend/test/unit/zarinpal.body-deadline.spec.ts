/**
 * REV-20261021-06: the Zarinpal deadline must cover the response body, not only the headers.
 * A real local HTTP server plays the provider; only the destination URL is rewritten.
 */
import * as http from 'http';
import { AddressInfo } from 'net';
import { ZarinpalService, ZarinpalGatewayError } from '../../src/service/zarinpal.service';

type Mode = 'stall-body' | 'slow-body' | 'malformed' | 'ok';

describe('Zarinpal client deadline covers the body (REV-20261021-06)', () => {
  let server: http.Server;
  let base: string;
  let mode: Mode = 'ok';
  const realFetch = global.fetch;
  const openSockets = new Set<import('net').Socket>();
  const envBackup = { ...process.env };

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      req.resume();
      if (mode === 'stall-body') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"data":');
        return; // never end
      }
      if (mode === 'slow-body') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write('{"data":{"code":100,');
        setTimeout(() => res.end('"ref_id":7}}'), 1500).unref();
        return;
      }
      if (mode === 'malformed') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"data":{"code":100,"ref_id":');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: { code: 100, ref_id: 42 }, errors: [] }));
    });
    server.on('connection', (s) => {
      openSockets.add(s);
      s.on('close', () => openSockets.delete(s));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    (global as any).fetch = (url: string, init: RequestInit) =>
      realFetch(base + new URL(url).pathname, init);
  });

  afterAll(async () => {
    (global as any).fetch = realFetch;
    for (const s of openSockets) s.destroy();
    await new Promise<void>((r) => server.close(() => r()));
  });

  beforeEach(() => {
    process.env = { ...envBackup, ZARINPAL_MERCHANT_ID: 'test-merchant', ZARINPAL_TIMEOUT_MS: '300' };
  });
  afterEach(() => {
    process.env = { ...envBackup };
  });

  async function verifyOutcome() {
    const started = Date.now();
    try {
      const r = await new ZarinpalService().verifyPayment('A0000000000000000000000000000000001', 10000);
      return { ok: true as const, r, ms: Date.now() - started };
    } catch (e) {
      return { ok: false as const, e: e as ZarinpalGatewayError, ms: Date.now() - started };
    }
  }

  it('headers fast, body stalled: rejects as retryable timeout within the deadline', async () => {
    mode = 'stall-body';
    const out = await verifyOutcome();
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.e).toBeInstanceOf(ZarinpalGatewayError);
    expect(out.e.retryable).toBe(true);
    expect(out.e.message).toContain('timeout after 300ms');
    expect(out.ms).toBeLessThan(1500);
  });

  it('body slower than the deadline: rejects, never reports paid', async () => {
    mode = 'slow-body';
    const out = await verifyOutcome();
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.e.retryable).toBe(true);
    expect(out.ms).toBeLessThan(1500);
  });

  it('malformed JSON body: rejects without a settled result', async () => {
    mode = 'malformed';
    const out = await verifyOutcome();
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.e).toBeInstanceOf(ZarinpalGatewayError);
    expect(out.e.message).toContain('malformed response body');
  });

  it('complete body within the deadline: verified with ref id', async () => {
    mode = 'ok';
    // Generous deadline: this case proves a normal response still verifies, not timing.
    process.env.ZARINPAL_TIMEOUT_MS = '5000';
    const out = await verifyOutcome();
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.r).toMatchObject({ Status: 100, RefID: 42 });
  });
});
