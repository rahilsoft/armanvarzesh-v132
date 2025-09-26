export type PaymentStatus = 'SUCCEEDED' | 'FAILED' | 'PENDING';

export interface PaymentProvider {
  fetchOrderStatus(orderId: string): Promise<PaymentStatus>;
}

export class LocalPaymentProvider implements PaymentProvider {
  async fetchOrderStatus(orderId: string): Promise<PaymentStatus> {
    // منطق شبیه‌سازی‌شده
    return 'SUCCEEDED';
  }
}
