import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../../src/payments/payments.service';
import { PrismaService } from '../../src/database/prisma.service';

class ZarinpalServiceMock {
  async requestPayment(amount: number, callbackUrl: string, description: string) { return 'AUTH123'; }
  async verifyPayment(authority: string, amount: number) { return true; }
}

const prismaMock = {
  payment: {
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findFirst: jest.fn().mockResolvedValue({ id: 1, authority: 'AUTH123' }),
    findUnique: jest.fn().mockResolvedValue({ id: 1, authority: 'AUTH123' }),
    update: jest.fn().mockResolvedValue({ id: 1, status: 'SUCCESS' }),
    findMany: jest.fn().mockResolvedValue([{ id: 1 }]),
  }
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    // @ts-expect-error override private field for test
    service['zarinpal'] = new ZarinpalServiceMock();
  });

  it('should create payment and return authority', async () => {
    const auth = await service.create(10, 5000, 'desc', 'http://cb');
    expect(auth).toBe('AUTH123');
    expect(prismaMock.payment.create).toHaveBeenCalled();
  });

  it('should verify payment and update status', async () => {
    const ok = await service.verify('AUTH123', 5000);
    expect(ok).toBe(true);
    expect(prismaMock.payment.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: 'SUCCESS' } }));
  });

  it('should find one payment', async () => {
    const p = await service.findOne(1);
    expect(p).toBeTruthy();
    expect(prismaMock.payment.findUnique).toHaveBeenCalled();
  });
});