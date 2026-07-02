import { BadRequestException, ConflictException } from '@nestjs/common';
import { PaymentsService } from '../payments.service';

// Rewritten to test the real implementation: PaymentsService is backed by
// SafePrismaService raw SQL (`query`/`exec`), not a `prisma.payment` model —
// the previous stub mocked an API the service never called.
function makeSafePrismaMock() {
  return {
    query: jest.fn().mockResolvedValue([]),
    exec: jest.fn().mockResolvedValue(undefined),
  };
}

describe('PaymentsService (legacy raw-SQL create path)', () => {
  it('creates a payment with the provided idempotency key', async () => {
    const prisma = makeSafePrismaMock();
    const svc = new PaymentsService(prisma as any);
    const p = await svc.create({ userId: 'u1', amountCents: 1000, currency: 'EUR', idempotencyKey: 'idem-1' });
    expect(p).toMatchObject({ idempotencyKey: 'idem-1', status: 'CREATED', currency: 'EUR' });
    expect(prisma.exec).toHaveBeenCalledTimes(1);
  });

  it('rejects a duplicate idempotency key', async () => {
    const prisma = makeSafePrismaMock();
    prisma.query.mockResolvedValueOnce([{ id: 1 }]); // existing row found
    const svc = new PaymentsService(prisma as any);
    await expect(
      svc.create({ userId: 'u1', amountCents: 1000, currency: 'EUR', idempotencyKey: 'idem-1' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.exec).not.toHaveBeenCalled();
  });

  it('rejects non-positive amounts and malformed currency', async () => {
    const prisma = makeSafePrismaMock();
    const svc = new PaymentsService(prisma as any);
    await expect(svc.create({ userId: 'u1', amountCents: 0, currency: 'EUR' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.create({ userId: 'u1', amountCents: 100, currency: 'EURO' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
