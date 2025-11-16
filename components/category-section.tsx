"use client";

import { easeOut, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Hair Growth",
    description: "Stimulate growth and strengthen from root to tip",
    image: "/hair-growth-products.jpg",
    color: "from-amber-50 to-orange-50",
  },
  {
    id: 2,
    name: "Deep Conditioning",
    description: "Intensive moisture and restoration treatments",
    image: "/deep-conditioning-mask.jpg",
    color: "from-rose-50 to-pink-50",
  },
  {
    id: 3,
    name: "Scalp Care",
    description: "Nourish and balance your scalp health",
    image: "/scalp-treatment-oil.jpg",
    color: "from-green-50 to-emerald-50",
  },
  {
    id: 4,
    name: "Hair Loss Prevention",
    description: "Combat breakage and hair loss naturally",
    image: "/hair-loss-prevention.jpg",
    color: "from-blue-50 to-cyan-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export function CategorySection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-background border-b border-primary/60">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-serif  text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect Revival Glow products for your hair care needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link
                href={`/products?category=${category.name
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <div
                  className={`bg-gradient-to-br ${category.color} rounded-lg overflow-hidden mb-4 h-48 relative`}
                >
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-amber-700 transition-colors">
                      {category.name}
                    </h3>
                    <ArrowRight
                      size={20}
                      className="text-muted-foreground group-hover:text-amber-700 group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
