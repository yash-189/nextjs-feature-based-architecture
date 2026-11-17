const formatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(cents: number) {
  return formatter.format(cents / 100);
}
