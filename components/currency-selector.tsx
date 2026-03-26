"use client";

import React from "react";
import { useCurrency } from "@/contexts/currency-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function CurrencySelector() {
  const { currentCurrency, setCurrency, currencies } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currentCurrency.code} onValueChange={setCurrency}>
        <SelectTrigger className="w-[120px] h-9 border-none bg-transparent hover:bg-muted/50 focus:ring-0">
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <span className="flex items-center gap-2">
                <span className="font-medium">{currency.code}</span>
                <span className="text-muted-foreground text-xs">({currency.symbol})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
