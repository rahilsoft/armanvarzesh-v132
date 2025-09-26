import { IdempotencyService } from '../src/common/idempotency/idempotency.service';

describe('IdempotencyService (memory)', () => {
  beforeAll(() => { process.env.REDIS_URL = 'memory://local'; process.env.IDEMPOTENCY_TTL = '10'; });
  it('allows first call then replays', async () => {
    const idem = new IdempotencyService();
    const key = 'unit-1';
    const v1 = await idem.ensureAndReplay(key, async () => ({ ok: true, at: 1 }));
    expect(v1.ok).toBe(true);
    const v2 = await idem.ensureAndReplay(key, async () => ({ ok: true, at: 2 }));
    expect(v2.at).toBe(1); // replayed
  });
  it('throws on duplicate without prior value', async () => {
    const idem = new IdempotencyService();
    const key = 'unit-2';
    await idem.ensure(key);
    await expect(idem.ensure(key)).rejects.toBeTruthy();
  });
});
