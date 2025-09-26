const ISO_CURRENCIES = new Set<string>(['IRR','USD','EUR','GBP','TRY','AED']);

export function assertPositiveAmount(amountCents: number) {
  if (!(Number.isInteger(amountCents) && amountCents > 0)) {
    throw new Error('amountCents must be a positive integer');
  }
}

export function assertCurrency(code: string) {
  const up = String(code || '').toUpperCase();
  if (!ISO_CURRENCIES.has(up)) {
    throw new Error(`Unsupported currency: ${code}`);
  }
}
