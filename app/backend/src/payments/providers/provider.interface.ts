export interface PaymentProvider {
  verifyWebhook(payload: any, signature: string | undefined): Promise<{ eventId: string; type: string; orderId: string; amount: number; status: 'SUCCEEDED'|'FAILED'|'PENDING' }>;
  fetchOrderStatus(orderId: string): Promise<'SUCCEEDED'|'FAILED'|'PENDING'>;
}
