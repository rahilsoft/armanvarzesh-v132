import {
  PaymentStore,
  PrismaPaymentStore,
  StoredPayment,
  ZarinpalClient,
  ZarinpalPaymentProvider,
} from '../../src/payments/providers/payment.provider';
import { PaymentsService } from '../../src/payments/payments.service';
import { ZarinpalGatewayError } from '../../src/service/zarinpal.service';

/** In-memory test double for the Payment table with conditional markPaid semantics. */
function memoryStore(rows: StoredPayment[]): PaymentStore & { rows: Map<string, StoredPayment>; credits: number; failures: number } {
  const map = new Map(rows.map((r) => [r.authority, { ...r }]));
  const store = {
    rows: map,
    credits: 0,
    failures: 0,
    async markFailed(a: string) {
      const r = map.get(a);
      if (!r || r.status !== 'pending') return false;
      r.status = 'failed';
      store.failures++;
      return true;
    },
    async findByAuthority(a: string) {
      const r = map.get(a);
      return r ? { ...r } : null;
    },
    async markPaid(a: string, amount: number) {
      const r = map.get(a);
      if (!r || r.amount !== amount || r.status === 'paid') return false;
      r.status = 'paid';
      store.credits++;
      return true;
    },
  };
  return store;
}

function gateway(code = 100): jest.Mocked<ZarinpalClient> {
  return {
    requestPayment: jest.fn(),
    verifyPayment: jest.fn().mockImplementation(async () => {
      if (code !== 100 && code !== 101) throw new Error('Zarinpal verification failed: code ' + code);
      return { Status: code, RefID: 9001, raw: { code } };
    }),
  } as any;
}

describe('ZarinpalPaymentProvider.verifyCallback (stored-amount verification)', () => {
  it('uses the stored amount for gateway verify, never the client amount', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const r = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    expect(r).toMatchObject({ ok: true, reference: '9001', amount: 50000, alreadyPaid: false });
    expect(gw.verifyPayment).toHaveBeenCalledWith('A1', 50000);
    expect(store.rows.get('A1')!.status).toBe('paid');
  });

  it('rejects a tampered (under-paid) client amount without calling the gateway', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const r = await p.verifyCallback({ Status: 'OK', Authority: 'A1', Amount: '1000' });
    expect(r).toMatchObject({ ok: false, reason: 'amount_mismatch' });
    expect(gw.verifyPayment).not.toHaveBeenCalled();
    expect(store.rows.get('A1')!.status).toBe('pending');
  });

  it('rejects an unknown authority', async () => {
    const store = memoryStore([]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const r = await p.verifyCallback({ Status: 'OK', Authority: 'NOPE' });
    expect(r).toMatchObject({ ok: false, reason: 'unknown_authority' });
    expect(gw.verifyPayment).not.toHaveBeenCalled();
  });

  it('is idempotent: a second callback returns the existing result without re-crediting', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(101);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const first = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    const second = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    expect(first).toMatchObject({ ok: true, alreadyPaid: false });
    expect(second).toMatchObject({ ok: true, alreadyPaid: true, amount: 50000 });
    expect(store.credits).toBe(1);
    expect(gw.verifyPayment).toHaveBeenCalledTimes(1);
  });

  it('does not re-credit when a concurrent callback settled first', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const [a, b] = await Promise.all([
      p.verifyCallback({ Status: 'OK', Authority: 'A1' }),
      p.verifyCallback({ Status: 'OK', Authority: 'A1' }),
    ]);
    expect(store.credits).toBe(1);
    expect([a.alreadyPaid, b.alreadyPaid].sort()).toEqual([false, true]);
  });

  it('does not mark paid when gateway verify fails', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(-51);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const r = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    expect(r).toMatchObject({ ok: false, reason: 'gateway_rejected' });
    expect(store.rows.get('A1')!.status).toBe('pending');
    expect(store.credits).toBe(0);
  }, 15000);

  it('does not mark paid when gateway returns an unexpected status', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(100);
    gw.verifyPayment.mockResolvedValue({ Status: 102, RefID: undefined });
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    const r = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    expect(r.ok).toBe(false);
    expect(store.credits).toBe(0);
  });

  it('rejects callbacks with NOK status or missing authority', async () => {
    const store = memoryStore([{ authority: 'A1', amount: 50000, status: 'pending' }]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    expect((await p.verifyCallback({ Status: 'NOK', Authority: 'A1' })).reason).toBe('cancelled');
    expect((await p.verifyCallback({ Status: 'NOK', Authority: 'GHOST' })).reason).toBe('unknown_authority');
    expect((await p.verifyCallback({ Status: 'OK' })).reason).toBe('invalid_callback');
    expect((await p.verifyCallback({ Status: 'MAYBE', Authority: 'A1' })).reason).toBe('invalid_callback');
    expect(gw.verifyPayment).not.toHaveBeenCalled();
  });

  it('NOK moves pending to failed once, never touches paid, and a later verified OK still settles', async () => {
    const store = memoryStore([
      { authority: 'A1', amount: 50000, status: 'pending' },
      { authority: 'P1', amount: 50000, status: 'paid' },
    ]);
    const gw = gateway(100);
    const p = new ZarinpalPaymentProvider('m-1', store, gw);
    await p.verifyCallback({ Status: 'NOK', Authority: 'A1' });
    await p.verifyCallback({ Status: 'NOK', Authority: 'A1' });
    expect(store.rows.get('A1')?.status).toBe('failed');
    expect(store.failures).toBe(1);

    const paid = await p.verifyCallback({ Status: 'NOK', Authority: 'P1' });
    expect(paid).toMatchObject({ ok: true, alreadyPaid: true });
    expect(store.rows.get('P1')?.status).toBe('paid');

    // A forged NOK cannot block a real payment: the verified OK callback settles it.
    const ok = await p.verifyCallback({ Status: 'OK', Authority: 'A1' });
    expect(ok.ok).toBe(true);
    expect(store.rows.get('A1')?.status).toBe('paid');
    expect(store.credits).toBe(1);
  });

  it('transport failure keeps the row pending, business rejection marks it failed', async () => {
    const store = memoryStore([
      { authority: 'T1', amount: 50000, status: 'pending' },
      { authority: 'B1', amount: 50000, status: 'pending' },
    ]);
    const gw = {
      requestPayment: jest.fn(),
      verifyPayment: jest.fn().mockImplementation(async (a: string) => {
        if (a === 'T1') throw new ZarinpalGatewayError('down', true);
        throw new ZarinpalGatewayError('code -51', false, '-51');
      }),
    };
    const p = new ZarinpalPaymentProvider('m-1', store, gw as any);
    expect((await p.verifyCallback({ Status: 'OK', Authority: 'B1' })).reason).toBe('gateway_rejected');
    expect(store.rows.get('B1')?.status).toBe('failed');
    expect((await p.verifyCallback({ Status: 'OK', Authority: 'T1' })).reason).toBe('gateway_rejected');
    expect(store.rows.get('T1')?.status).toBe('pending');
  }, 30_000);
});

describe('PrismaPaymentStore', () => {
  it('reads the stored row and updates conditionally on amount and unpaid status', async () => {
    const db = {
      query: jest.fn().mockResolvedValue([{ authority: 'A1', amount: 50000, status: 'pending' }]),
      exec: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0),
    };
    const s = new PrismaPaymentStore(db);
    expect(await s.findByAuthority('A1')).toEqual({ authority: 'A1', amount: 50000, status: 'pending' });
    expect(await s.markPaid('A1', 50000)).toBe(true);
    expect(await s.markPaid('A1', 50000)).toBe(false);
    const sql = db.exec.mock.calls[0][0];
    expect(sql.sql).toMatch(/WHERE authority = \? AND amount = \? AND status <> \?/);
    expect(sql.values).toEqual(['paid', 'A1', 50000, 'paid']);
  });

  it('markFailed updates only a pending row (never a paid one) with parameterized SQL', async () => {
    const db = { query: jest.fn(), exec: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0) };
    const s = new PrismaPaymentStore(db);
    expect(await s.markFailed('A1')).toBe(true);
    expect(await s.markFailed('A1')).toBe(false);
    const sql = db.exec.mock.calls[0][0];
    expect(sql.sql).toMatch(/SET status = \? WHERE authority = \? AND status = \?$/);
    expect(sql.values).toEqual(['failed', 'A1', 'pending']);
  });

  it('returns null for an unknown authority', async () => {
    const s = new PrismaPaymentStore({ query: jest.fn().mockResolvedValue([]), exec: jest.fn() });
    expect(await s.findByAuthority('X')).toBeNull();
  });
});

describe('PaymentsService.verify (routed through Zarinpal verify)', () => {
  const ENV = { ...process.env };
  afterEach(() => {
    process.env = { ...ENV };
  });

  it('fails fast without ZARINPAL_MERCHANT_ID and never marks paid', async () => {
    delete process.env.ZARINPAL_MERCHANT_ID;
    const db = { query: jest.fn().mockResolvedValue([{ authority: 'A1', amount: 100, status: 'pending' }]), exec: jest.fn() };
    const svc = new PaymentsService(db as any);
    await expect(svc.verify('A1', 100, 'OK')).rejects.toThrow(/ZARINPAL_MERCHANT_ID/);
    expect(db.exec).not.toHaveBeenCalled();
  });

  it('marks paid only after the gateway confirms, using the stored amount', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'm-1';
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: { code: 100, ref_id: 5 }, errors: [] }) });
    (global as any).fetch = fetchMock;
    const db = {
      query: jest.fn().mockResolvedValue([{ authority: 'A1', amount: 70000, status: 'pending' }]),
      exec: jest.fn().mockResolvedValue(1),
    };
    const svc = new PaymentsService(db as any);
    expect(await svc.verify('A1', 70000, 'OK')).toBe(true);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ amount: 70000, authority: 'A1' });
    expect(db.exec).toHaveBeenCalledTimes(1);
  });

  it('rejects a tampered amount without marking paid', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'm-1';
    (global as any).fetch = jest.fn();
    const db = {
      query: jest.fn().mockResolvedValue([{ authority: 'A1', amount: 70000, status: 'pending' }]),
      exec: jest.fn(),
    };
    const svc = new PaymentsService(db as any);
    expect(await svc.verify('A1', 100, 'OK')).toBe(false);
    expect((global as any).fetch).not.toHaveBeenCalled();
    expect(db.exec).not.toHaveBeenCalled();
  });
});
