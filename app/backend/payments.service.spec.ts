import { PaymentsService } from './src/payments/payments.service';

class MockPrisma {
  public queries: any[] = [];
  public execs: any[] = [];
  async query<T>(_sql: any): Promise<T[]> {
    this.queries.push(_sql);
    // emulate "no duplicate" by default
    return [] as any;
  }
  async exec(_sql: any): Promise<void> {
    this.execs.push(_sql);
    return;
  }
}

describe('PaymentsService', () => {
  it('creates a payment successfully', async () => {
    const prisma = new MockPrisma() as any;
    const svc = new (PaymentsService as any)(prisma);
    const res = await svc.create({ userId: 'u1', amountCents: 5000, currency: 'IRR' });
    expect(res).toMatchObject({ userId: 'u1', amountCents: 5000, currency: 'IRR', status: 'CREATED' });
    expect(prisma.execs.length).toBe(1);
  });

  it('rejects invalid amount', async () => {
    const prisma = new MockPrisma() as any;
    const svc = new (PaymentsService as any)(prisma);
    await expect(svc.create({ userId: 'u1', amountCents: 0, currency: 'IRR' })).rejects.toBeTruthy();
  });

  it('rejects duplicate by idempotency', async () => {
    const prisma = new (class extends MockPrisma {
      async query<T>(_sql: any): Promise<T[]> { return [{}] as any; }
    })() as any;
    const svc = new (PaymentsService as any)(prisma);
    await expect(svc.create({ userId: 'u1', amountCents: 100, currency: 'IRR', idempotencyKey: 'dup' })).rejects.toBeTruthy();
  });
});
