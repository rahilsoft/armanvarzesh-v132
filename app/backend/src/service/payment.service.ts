import { Injectable, Logger } from '@nestjs/common';
import { PaymentInput } from '../dto/payment.input';
import { ZarinpalService } from './zarinpal.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private zarinpal = new ZarinpalService();

  async makePayment(input: PaymentInput) {
    this.logger.log(`Starting payment for user ${input.userId} amount ${input.amount}`);
    const callbackUrl = `https://yourdomain.com/payment/callback`;

    const res = await this.zarinpal.requestPayment(
      input.amount,
      callbackUrl,
      'Payment for ArmanVarzesh',
      '', ''
    );

    if (res.Status !== 100) {
      this.logger.error(`Payment request failed: ${res.Status}`);
      throw new Error('Payment request failed');
    }

    // Save transaction with Authority code and Pending status (mock)
    // await this.paymentRepository.save({ ... });

    this.logger.log(`Payment request successful: Authority ${res.Authority}`);
    return { authority: res.Authority, paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${res.Authority}` };
  }

  async verifyPayment(authority: string, amount: number) {
    this.logger.log(`Verifying payment Authority: ${authority}`);

    const res = await this.zarinpal.verifyPayment(authority, amount);

    if (res.Status !== 100) {
      this.logger.error(`Payment verification failed: ${res.Status}`);
      throw new Error('Payment verification failed');
    }

    // Update transaction status to Completed (mock)
    // await this.paymentRepository.updateStatus(authority, 'Completed');

    this.logger.log(`Payment verified successfully`);
    return { success: true, refId: res.RefID };
  }
}
