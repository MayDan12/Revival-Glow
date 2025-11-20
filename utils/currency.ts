// utils/currency.ts
export const formatCurrency = (amount: number, isCents: boolean = true) => {
  const amountInDollars = isCents ? amount / 100 : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInDollars);
};

export const toCents = (dollars: number) => Math.round(dollars * 100);
export const toDollars = (cents: number) => cents / 100;
