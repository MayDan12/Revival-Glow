"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Image from "next/image";

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
    <footer className="bg-background/95 border-t border-gray-300 text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <motion.div variants={itemVariants} className="md:col-span-2">
            <div className="text-2xl text-gray-800 font-serif mb-4">
              {"Revival Glow"}
            </div>
            <p className="text-gray-800  leading-relaxed max-w-md">
              {
                "Handcrafted hair care inspired by African and Ayurvedic traditions. We believe every strand deserves deep restoration and radiant beauty from root to tip."
              }
            </p>
            <motion.div className="flex gap-4 mt-4">
              <Instagram className="text-gray-800 hover:text-[#E4405F] transition-colors" />{" "}
              {/* Instagram pink */}
              <Facebook className="text-gray-800 hover:text-[#1877F2] transition-colors" />{" "}
              {/* Facebook blue */}
              <Twitter className="text-gray-800 hover:text-[#1DA1F2] transition-colors" />{" "}
              {/* Twitter blue */}
              <Mail className="text-gray-800 hover:text-[#EA4335] transition-colors" />{" "}
              {/* Gmail red */}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-gray-800 mb-4">{"Quick Links"}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Products"}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"About Us"}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Contact"}
                </Link>
              </li>
              <li>
                <Link
                  href="/tracking"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Track Orders"}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Care */}
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-gray-800 mb-4">
              {"Customer Care"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Shipping Info"}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Returns"}
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  {"Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-800 hover:text-primary transition-colors"
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
          className="border-t border-gray-300 pt-8 text-center"
        >
          <p className="text-gray-800 text-sm">
            {"For inquiries, please contact:"}
          </p>
          <p className="text-gray-800 text-sm">{"info@revivalglowcare.com"}</p>
          <p className="text-gray-800 text-sm">
            {"© 2025 Revival Glow. All rights reserved."}
          </p>
        </motion.div>
        {/* Payment Options */}
        <div className="mt-6 flex justify-center gap-4">
          <Image
            src="/payments/visa.png"
            alt="Visa"
            className="h-8 object-contain"
            width={48}
            height={24}
          />
          <Image
            src="/payments/mastercard.png"
            alt="Mastercard"
            className="h-8 object-contain"
            width={48}
            height={24}
          />
          <Image
            src="/payments/amex.png"
            alt="American Express"
            className="h-8 object-contain"
            width={48}
            height={24}
          />
          {/* <Image
            src="/payments/paypal.png"
            alt="PayPal"
            className="h-8 object-contain"
            width={48}
            height={24}
          /> */}
        </div>
      </div>
    </footer>
  );
}
