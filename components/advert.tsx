"use client";
import { motion } from "framer-motion";
import { useCurrency } from "@/contexts/currency-context";

export function Advert() {
  const { formatPrice } = useCurrency();
  const messages = [
    `Free Shipping — First 100 Orders Only`,
    "Save $10 on Roote Hair Oil — Now $69",
    "Buy 2, Save $13 — Now $123",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-50 h-10 w-full bg-primary text-primary-foreground"
    >
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="relative h-full overflow-hidden flex items-center justify-center">
          <div className="advert-marquee inline-flex items-center whitespace-nowrap gap-8">
            {messages.concat(messages).map((msg, idx) => (
              <span key={idx} className="text-xs sm:text-sm font-serif">
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
