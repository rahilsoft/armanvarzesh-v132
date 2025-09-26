export function formatCurrency(amountCents: number, currency = 'IRR', locale = 'fa-IR') {
  const amount = (amountCents || 0) / 100;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
