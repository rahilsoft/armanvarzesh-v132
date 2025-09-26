import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../../src/service/payment.service';
import { PaymentInput } from '../../src/dto/payment.input';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should process payment successfully', async () => {
    const input = new PaymentInput();
    input.userId = 'u1';
    input.amount = 500000;
    input.method = 'zarinpal';

    const result = await service.makePayment(input);
    expect(result.success).toBe(true);
    expect(result.transactionId).toBeDefined();
  });
});
