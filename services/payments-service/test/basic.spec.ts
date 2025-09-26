import { PaymentsServiceService } from '../src/payments-service.service';

describe('payments-service service', () => {
  it('alive', () => {
    const s = new PaymentsServiceService();
    expect(typeof s.health).toBe('function');
  });
});
