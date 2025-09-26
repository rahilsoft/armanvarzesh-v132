export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}