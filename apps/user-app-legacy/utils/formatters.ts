
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} Toman`;
}
