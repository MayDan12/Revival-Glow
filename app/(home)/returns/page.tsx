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
      title: "14-Day Return Window",
      description:
        "You have 14 days from the date of delivery to initiate a return for unopened products.",
    },
    {
      icon: Package,
      title: "Initiate Return",
      description:
        "Email our customer support team with your order number and reason for return to get approved.",
    },
    {
      icon: RotateCcw,
      title: "Ship Products Back",
      description:
        "Once approved, we'll provide instructions for the return process.",
    },
    {
      icon: Shield,
      title: "Inspection & Refund",
      description:
        "Once we receive your return, we'll inspect it and process your refund within 5-10 business days.",
    },
  ];

  const conditions = [
    {
      title: "Unopened & Unused",
      description:
        "Products must be in their original, unopened condition with the seal fully intact.",
      icon: Package,
    },
    {
      title: "Health & Safety Policy",
      description:
        "Due to the nature of our products, all sales are final once the seal has been broken or removed.",
      icon: Shield,
    },
    {
      title: "Proof of Purchase",
      description:
        "You'll need your original order confirmation or receipt to process the return.",
      icon: CheckCircle,
    },
    {
      title: "Damaged Items",
      description:
        "Contact us within 48 hours of delivery with photos if your order arrives damaged or incorrect.",
      icon: AlertCircle,
    },
  ];

  const faqItems = [
    {
      q: "What is your return policy?",
      a: "We accept returns for unopened and unused products with the original seal fully intact within 14 days of delivery. Due to the nature of our products, all sales are final once the seal is broken.",
    },
    {
      q: "Can I return opened or used products?",
      a: "No. To protect the health and safety of all our customers, we cannot guarantee the purity or safety of a product once it has left our control. Products with a broken or tampered seal, or that show signs of use, are non-returnable.",
    },
    {
      q: "How do I request a return?",
      a: "Email us at info@revivalglow.com with your order number and reason for return. Once approved, we'll provide instructions for the return process.",
    },
    {
      q: "How long does it take to process a refund?",
      a: "Approved refunds will be processed to your original payment method within 5–10 business days of us receiving and inspecting the returned item.",
    },
    {
      q: "What if I received a damaged or incorrect product?",
      a: "If your order arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery with photos of the product and packaging. We'll arrange a replacement or refund at no extra cost to you.",
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
            className="text-2xl md:text-4xl font-serif font-bold text-foreground mb-4"
          >
            Returns & Refunds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Read our return and refund policy below to understand how we process
            returns for our products.
          </motion.p>
        </div>
      </section>

      {/* Health & Safety Guarantee Banner */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg border-2 border-amber-500 p-8 text-center"
          >
            <div className="inline-block p-3 bg-amber-50 rounded-lg mb-4">
              <Shield className="text-amber-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Health & Safety Guarantee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This policy is in place to protect the health and safety of all
              our customers, as we cannot guarantee the purity or safety of a
              product once it has left our control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-12 text-center">
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
          <h2 className="text-2xl font-serif font-bold text-foreground mb-12 text-center">
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
          <h2 className="text-2xl font-serif font-bold text-foreground mb-12 text-center">
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
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
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
                  href="mailto:info@revivalglow.com"
                  className="text-green-600 hover:underline"
                >
                  info@revivalglow.com
                </a>
              </p>
              {/* <p>
                <span className="font-semibold text-foreground">Phone:</span>{" "}
                <a
                  href="tel:+15551234567"
                  className="text-green-600 hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </p> */}
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
