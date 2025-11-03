"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { easeInOut, motion } from "framer-motion";
import { Leaf, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Natural Ingredients",
      description:
        "Handcrafted with natural oils, herbs, and plant-based ingredients inspired by African and Ayurvedic traditions.",
    },
    {
      icon: Heart,
      title: "Authentic Care",
      description:
        "We believe every strand deserves deep restoration and radiant beauty. Our products are made with genuine care for your hair journey.",
    },
    {
      icon: Sparkles,
      title: "Visible Results",
      description:
        "Experience transformative results with our scientifically-formulated blends that promote strong, healthy, and radiant hair.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeInOut },
    },
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 text-balance">
              {"Revive Your Roots, Reveal Your Glow"}
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              {
                "Revival Glow was born from the belief that every strand of hair deserves revival — not just beauty on the surface, but deep restoration from root to tip."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                {"Our Story"}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {
                  "Revival Glow emerged from a deep passion for natural hair care and a commitment to honoring traditional remedies. Inspired by the wisdom of African and Ayurvedic traditions, we discovered that the most powerful solutions for hair restoration come from nature itself."
                }
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {
                  "We noticed that many people struggled with hair loss, dryness, and breakage — often turning to harsh chemicals that only made things worse. We believed there had to be a better way. So we set out to create products that would truly restore hair from root to tip, using only the finest natural ingredients."
                }
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {
                  "Today, Revival Glow stands as a testament to the power of nature, authenticity, and genuine care. Every product we create is handcrafted with intention, designed to help you revive your roots and reveal your natural glow."
                }
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              {"Our Values"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {"These principles guide everything we do at Revival Glow"}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Brand Essence */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
              {"Our Essence"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Confidence", "Growth", "Natural Beauty", "Purity"].map(
                (essence, index) => (
                  <motion.div
                    key={essence}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-secondary/50 rounded-lg text-center"
                  >
                    <p className="text-lg font-medium text-foreground">
                      {essence}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
              {"Who We Serve"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {
                "Revival Glow is for women and men seeking natural solutions for hair loss, dryness, or breakage. We serve those who value clean beauty, authenticity, and visible results."
              }
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {
                "If you're on a hair journey and believe in the power of nature, you've found your community. We're here to support you every step of the way with warm, encouraging, and authentic care."
              }
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
