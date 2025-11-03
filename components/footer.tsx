"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-[#C4592D] text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="text-2xl font-serif mb-4">{"Revival Glow"}</div>
            <p className="text-background/80 leading-relaxed max-w-md">
              {
                "Handcrafted hair care inspired by African and Ayurvedic traditions. We believe every strand deserves deep restoration and radiant beauty from root to tip."
              }
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-4">{"Quick Links"}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"Products"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"Contact"}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Care */}
          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-4">{"Customer Care"}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"Shipping Info"}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"Returns"}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-background/80 hover:text-background transition-colors"
                >
                  {"FAQ"}
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-background/20 pt-8 text-center"
        >
          <p className="text-background/60 text-sm">
            {"© 2025 Revival Glow. All rights reserved."}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
