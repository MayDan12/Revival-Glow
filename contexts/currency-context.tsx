"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Currency = {
  code: string;
  symbol: string;
  label: string;
  rate: number; // Rate relative to CAD (CAD = 1.0)
};

const DEFAULT_CURRENCIES: Currency[] = [
  { code: "CAD", symbol: "$", label: "Canadian Dollar", rate: 1.0 },
  { code: "USD", symbol: "$", label: "US Dollar", rate: 0.73 },
  { code: "EUR", symbol: "€", label: "Euro", rate: 0.67 },
  { code: "GBP", symbol: "£", label: "British Pound", rate: 0.57 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", rate: 1.12 },
  { code: "NGN", symbol: "₦", label: "Nigerian Naira", rate: 1100 },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (code: string) => void;
  currencies: Currency[];
  convert: (amount: number) => number;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(
    DEFAULT_CURRENCIES[0],
  );

  // Fetch real-time rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/CAD");
        const data = await response.json();

        if (data && data.rates) {
          const updatedCurrencies = DEFAULT_CURRENCIES.map((c) => ({
            ...c,
            rate: data.rates[c.code] || c.rate,
          }));
          setCurrencies(updatedCurrencies);

          // Update current currency with new rate
          const savedCurrency = localStorage.getItem("currency");
          const codeToFind = savedCurrency || "CAD";
          const found = updatedCurrencies.find((c) => c.code === codeToFind);
          if (found) setCurrentCurrency(found);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    }

    fetchRates();
  }, []);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      const found = currencies.find((c) => c.code === savedCurrency);
      if (found) setCurrentCurrency(found);
    }
  }, [currencies]);

  const setCurrency = (code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setCurrentCurrency(found);
      localStorage.setItem("currency", code);
    }
  };

  const convert = (amount: number) => {
    return amount * currentCurrency.rate;
  };

  const formatPrice = (amount: number) => {
    const converted = convert(amount);
    return `${currentCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        currencies,
        convert,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
