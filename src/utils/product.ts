export function discountedPrice(price: number, discountPercentage: number): number {
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}
