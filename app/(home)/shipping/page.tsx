"use client";

import { motion } from "framer-motion";
import { Truck, Package, Clock, Globe, CheckCircle } from "lucide-react";

export default function ShippingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const shippingOptions = [
    {
      icon: Clock,
      name: "Standard Shipping",
      timeframe: "5-7 Business Days",
      cost: "Free on orders over $50",
      basePrice: "$5.99",
      description:
        "Perfect for orders that aren't urgent. Your Revival Glow products will arrive safely within a week.",
    },
    {
      icon: Truck,
      name: "Express Shipping",
      timeframe: "2-3 Business Days",
      cost: "$12.99",
      basePrice: "",
      description:
        "Get your products faster with our express option. Great for when you can't wait to start your hair transformation.",
    },
    {
      icon: Package,
      name: "Overnight Shipping",
      timeframe: "Next Business Day",
      cost: "$24.99",
      basePrice: "",
      description:
        "Need it urgently? Our overnight option ensures your order arrives the next business day.",
    },
    {
      icon: Globe,
      name: "International Shipping",
      timeframe: "10-21 Business Days",
      cost: "Varies by Location",
      basePrice: "",
      description:
        "We ship to most countries worldwide. International orders include tracking and customs documentation.",
    },
  ];

  const faqItems = [
    {
      q: "Do you offer free shipping?",
      a: "Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a standard shipping fee of $5.99.",
    },
    {
      q: "Can I track my order?",
      a: "You'll receive a tracking number via email as soon as your order ships. You can track it in real-time on our partner carrier's website.",
    },
    {
      q: "What if my order arrives damaged?",
      a: "We're committed to delivering your products in perfect condition. If you receive a damaged item, contact us within 48 hours with photos, and we'll send a replacement immediately.",
    },
    {
      q: "Do you ship to PO boxes?",
      a: "We can ship to PO boxes for standard and express shipping options. However, overnight shipping requires a physical address.",
    },
    {
      q: "Can I change my shipping address after placing an order?",
      a: "If you contact us within 2 hours of placing your order, we can usually update the address. After that, you may need to refuse the original delivery and place a new order.",
    },
    {
      q: "How are my products packaged?",
      a: "All Revival Glow products are carefully packaged with protective materials and branded packaging to ensure they arrive in perfect condition and create an unboxing experience.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4"
          >
            Shipping Information
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Fast, reliable shipping to get your Revival Glow products to your
            door
          </motion.p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {shippingOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-8 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <IconComponent className="text-amber-600" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {option.name}
                      </h3>
                      <p className="text-amber-700 font-medium">
                        {option.timeframe}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="text-lg font-bold text-foreground">
                      {option.basePrice && (
                        <span className="text-sm text-muted-foreground mr-2">
                          Starting at
                        </span>
                      )}
                      {option.cost}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Delivery Timeline */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-amber-50/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-12 text-center">
            How It Works
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                step: 1,
                title: "Order Placed",
                description:
                  "You complete your Revival Glow order with your preferred shipping method.",
              },
              {
                step: 2,
                title: "Order Processing",
                description:
                  "We carefully prepare and pack your order within 1-2 business days.",
              },
              {
                step: 3,
                title: "Shipped & Tracked",
                description:
                  "Your package ships out and you receive a tracking number via email.",
              },
              {
                step: 4,
                title: "Delivered",
                description:
                  "Your products arrive safely at your doorstep, ready to transform your hair.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg"
                  >
                    {item.step}
                  </motion.div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-12 text-center">
            Shipping FAQs
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                  <CheckCircle
                    size={20}
                    className="text-amber-600 flex-shrink-0 mt-0.5"
                  />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground ml-7">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Shipping to Everywhere
            </h3>
            <p className="text-foreground/80 mb-4">
              We're committed to getting Revival Glow products to you wherever
              you are. While we currently handle most domestic and international
              orders, we're always expanding our shipping capabilities.
            </p>
            <p className="text-foreground/80">
              If you have any questions about shipping to your specific
              location, please don't hesitate to contact our customer support
              team. We're here to help make your Revival Glow experience
              seamless.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
