// Currency formatting for the payment schedule. Amounts are stored as integer cents on the server;
// divide by 100 for display. The /account tree is client-only, so locale-dependent Intl is safe.
export function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amountCents / 100)
}
