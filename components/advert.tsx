"use client";
import { motion } from "framer-motion";

export function Advert() {
  const messages = [
    "Free shipping on orders over $50",
    "New arrivals in store",
    "Holiday sale up to 30%",
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
