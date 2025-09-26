export type AccessToken = { token: string; exp: number };
export type RefreshToken = { token: string; exp: number };

export type AuthResult = {
  user: { id: string; username: string; roles: string[] };
  access: AccessToken;
  refresh: RefreshToken;
};

export type CreatePaymentInput = { userId: string; amountCents: number; currency: string; idempotencyKey?: string };
export type PaymentItem = { id: string; user_id: string; amount_cents: number; currency: string; status: string; created_at: Date };
export type PaymentList = { data: PaymentItem[]; nextCursor?: string };
