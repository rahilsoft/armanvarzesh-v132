import { PaymentsService } from '../../payments.service';
describe('PaymentsService', () => {
  it('creates payment and rejects duplicates', async () => {
    const created: any[] = [];
    const prisma: any = { payment: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn().mockImplementation(({ data }: any) => (created.push(data), Promise.resolve({ id: 'pay_1', ...data }))) } };
    const svc = new PaymentsService(prisma as any);
    const dto = { userId: 'u1', amountCents: 1000, currency: 'EUR', idempotencyKey: 'idem-1' };
    const p1 = await svc.create(dto); expect(p1.idempotencyKey).toBe('idem-1');
    prisma.payment.findUnique.mockResolvedValueOnce(p1);
    await expect(svc.create(dto)).rejects.toThrow(/Duplicate payment/);
  });
  it('rejects non-positive amount', async () => {
    const prisma: any = { payment: { findUnique: jest.fn(), create: jest.fn() } };
    const svc = new PaymentsService(prisma as any);
    // @ts-expect-error
    await expect(svc.create({ userId: 'u1', amountCents: 0, currency: 'EUR' })).rejects.toThrow();
  });
});
