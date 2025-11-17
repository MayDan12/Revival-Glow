"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";

export default function ReturnsPage() {
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

  const returnSteps = [
    {
      icon: Clock,
      title: "30-Day Return Window",
      description:
        "You have 30 days from the date of purchase to initiate a return for any reason.",
    },
    {
      icon: Package,
      title: "Initiate Return",
      description:
        "Contact our customer support team with your order number to start the return process.",
    },
    {
      icon: RotateCcw,
      title: "Ship Products Back",
      description:
        "We'll provide you with a prepaid shipping label to send the items back to us.",
    },
    {
      icon: Shield,
      title: "Inspection & Refund",
      description:
        "Once we receive your return, we'll inspect it and process your refund within 5-7 business days.",
    },
  ];

  const conditions = [
    {
      title: "Unopened & Unused",
      description:
        "Products must be in their original, unopened condition with all packaging intact.",
      icon: Package,
    },
    {
      title: "Product Condition",
      description:
        "While we accept returns for opened products if unsatisfied, unused items qualify for full refunds.",
      icon: Shield,
    },
    {
      title: "Proof of Purchase",
      description:
        "You'll need your original order confirmation or receipt to process the return.",
      icon: CheckCircle,
    },
    {
      title: "No Resale Products",
      description:
        "Products purchased during final sales, clearance, or closeout events are non-returnable.",
      icon: AlertCircle,
    },
  ];

  const faqItems = [
    {
      q: "What's your return policy?",
      a: "We offer a hassle-free 30-day money-back guarantee. If you're not completely satisfied with your Revival Glow products, we'll refund your purchase. Shipping costs are non-refundable unless the return is due to our error or a defective product.",
    },
    {
      q: "Can I return opened or used products?",
      a: "Yes, we accept returns of opened or used products within 30 days if you're not satisfied. However, unopened products in original condition will receive a full refund including shipping.",
    },
    {
      q: "How do I request a return?",
      a: "Email our customer support team at returns@revivalglow.com with your order number. We'll provide you with a prepaid return shipping label and instructions for sending your products back.",
    },
    {
      q: "How long does it take to process a refund?",
      a: "Once we receive your returned items and inspect them, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method.",
    },
    {
      q: "Do you accept exchanges?",
      a: "Yes! You can exchange products for a different size, scent, or product within 30 days. Contact our support team to arrange an exchange.",
    },
    {
      q: "What if I received a damaged or defective product?",
      a: "We're committed to quality. If you receive a damaged or defective product, contact us immediately with photos. We'll send a replacement right away, no questions asked.",
    },
    {
      q: "Are there any non-returnable items?",
      a: "Products purchased during final sales, clearance, or promotional closeouts are typically non-returnable. However, defective items are always covered under our guarantee.",
    },
    {
      q: "Can I return items purchased on sale?",
      a: "Yes, sale items can be returned within 30 days for a refund of the sale price you paid. Regular-priced returns receive a refund of the full original price.",
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
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Returns & Refunds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We stand behind our products. If you're not satisfied for any
            reason, we're here to help with our simple return process.
          </motion.p>
        </div>
      </section>

      {/* 30-Day Guarantee Banner */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-green-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg border-2 border-green-500 p-8 text-center"
          >
            <div className="inline-block p-3 bg-green-50 rounded-lg mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              30-Day Money-Back Guarantee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're confident you'll love Revival Glow products. If you don't,
              we'll refund your purchase in full, no questions asked.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            How to Return
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {returnSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 bg-green-50 rounded-lg inline-block mb-4">
                    <IconComponent className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                  {index < returnSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-12 w-6 h-0.5 bg-green-200" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-amber-50/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Return Conditions
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {conditions.map((condition, index) => {
              const IconComponent = condition.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 bg-white rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg flex-shrink-0">
                      <IconComponent className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {condition.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {condition.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
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
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground ml-7">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-border rounded-lg p-6 md:p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need Help with Your Return?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our customer support team is here to make the returns process as
              smooth as possible.
            </p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-foreground">Email:</span>{" "}
                <a
                  href="mailto:returns@revivalglow.com"
                  className="text-green-600 hover:underline"
                >
                  returns@revivalglow.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                <a
                  href="tel:+15551234567"
                  className="text-green-600 hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Monday - Friday, 9am - 6pm EST
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
