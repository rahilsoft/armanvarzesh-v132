// Phase H — Payments privacy utilities
export function maskCard(card: string): string {
  if (!card) return card as any;
  const digits = card.replace(/\D/g, '');
  if (digits.length < 12) return '****';
  return digits.slice(0, 6) + '******' + digits.slice(-4);
}
export function maskIban(iban: string): string {
  if (!iban) return iban as any;
  const clean = iban.replace(/\s+/g,'');
  if (clean.length < 10) return '****';
  return clean.slice(0, 4) + '********' + clean.slice(-4);
}
export function sanitizePaymentPayload(input: any): any {
  const out = { ...(input || {}) };
  if (out.cardNumber) out.cardNumber = maskCard(String(out.cardNumber));
  if (out.pan) out.pan = maskCard(String(out.pan));
  if (out.iban) out.iban = maskIban(String(out.iban));
  if (out.cvv) out.cvv = '[REDACTED]';
  if (out.cvc) out.cvc = '[REDACTED]';
  if (out.expMonth) out.expMonth = String(out.expMonth);
  if (out.expYear) out.expYear = String(out.expYear);
  return out;
}
