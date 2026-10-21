/**
 * Payment amount bounds. Amounts in this module are integers in Rial (IRR has no
 * minor unit, so `amountCents` and the Zarinpal `amount` are both plain Rial).
 * Zarinpal rejects requests under 10,000 Rial. The upper bound caps a single payment.
 */
export const MIN_PAYMENT_AMOUNT_RIAL = 10_000;
export const MAX_PAYMENT_AMOUNT_RIAL = 500_000_000;

export function isValidPaymentAmount(amount: unknown): amount is number {
  return (
    typeof amount === 'number' &&
    Number.isInteger(amount) &&
    amount >= MIN_PAYMENT_AMOUNT_RIAL &&
    amount <= MAX_PAYMENT_AMOUNT_RIAL
  );
}
