import { Injectable, Logger } from '@nestjs/common';
import { http } from '@arman/http-client';

@Injectable()
export class ZarinpalService {
  private readonly logger = new Logger(ZarinpalService.name);
  private get baseUrl() { return 'https://api.zarinpal.com/pg/v4/payment'; }

  async requestPayment(amount: number, callbackUrl: string, description = 'Payment'): Promise<{ authority: string }> {
    const merchant_id = process.env.ZARINPAL_MERCHANT_ID || '';
    const res = await http.post(`${this.baseUrl}/request.json`, {
      merchant_id, amount, description, callback_url: callbackUrl
    });
    const authority = res?.data?.data?.authority;
    if (!authority) throw new Error('Invalid Zarinpal response');
    return { authority };
  }

  async verifyPayment(amount: number, authority: string): Promise<boolean> {
    const merchant_id = process.env.ZARINPAL_MERCHANT_ID || '';
    const res = await http.post(`${this.baseUrl}/verify.json`, {
      merchant_id, amount, authority
    });
    const code = res?.data?.data?.code;
    return code === 100 || code === 101;
  }
}
