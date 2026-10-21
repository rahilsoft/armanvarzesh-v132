import { UnauthorizedException } from '@nestjs/common';
import { BookingController } from '../booking.controller';
import { computeWebhookSignature } from '../../common/security/webhook-signature';

describe('BookingController payments/success uses BOOKING_WEBHOOK_SECRET', () => {
  const ENV = { ...process.env };
  const BOOKING = 'b'.repeat(40);
  const PSP = 'p'.repeat(40);
  afterEach(() => {
    process.env = { ...ENV };
  });

  function ctrl() {
    const booking = { confirmPayment: jest.fn().mockResolvedValue({ ok: true }) } as any;
    return { booking, c: new BookingController(booking) };
  }

  it('accepts a body signed with BOOKING_WEBHOOK_SECRET', async () => {
    process.env.BOOKING_WEBHOOK_SECRET = BOOKING;
    process.env.PAYMENTS_WEBHOOK_SECRET = PSP;
    const { booking, c } = ctrl();
    const body: any = { bookingId: 5, paymentRef: 'R-1' };
    body.signature = computeWebhookSignature(BOOKING, body);
    await c.paymentSuccess(body);
    expect(booking.confirmPayment).toHaveBeenCalledWith(5, 'R-1');
  });

  it('rejects a body signed with the PSP secret', () => {
    process.env.BOOKING_WEBHOOK_SECRET = BOOKING;
    process.env.PAYMENTS_WEBHOOK_SECRET = PSP;
    const { booking, c } = ctrl();
    const body: any = { bookingId: 5, paymentRef: 'R-1' };
    body.signature = computeWebhookSignature(PSP, body);
    expect(() => c.paymentSuccess(body)).toThrow(UnauthorizedException);
    expect(booking.confirmPayment).not.toHaveBeenCalled();
  });

  it('fails closed in production when BOOKING_WEBHOOK_SECRET is missing, even if PAYMENTS_WEBHOOK_SECRET is set', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.BOOKING_WEBHOOK_SECRET;
    process.env.PAYMENTS_WEBHOOK_SECRET = PSP;
    const { booking, c } = ctrl();
    const body: any = { bookingId: 5, paymentRef: 'R-1' };
    body.signature = computeWebhookSignature(PSP, body);
    expect(() => c.paymentSuccess(body)).toThrow(/booking webhook secret is not configured/);
    expect(booking.confirmPayment).not.toHaveBeenCalled();
  });
});
