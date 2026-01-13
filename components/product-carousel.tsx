"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/products";
import { useContents } from "@/hooks/useContents";

export function ProductCarousel() {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { fetchContents } = useContents();
  const [contents, setContents] = useState<
    { id: string; name: string; value: string | string[] }[]
  >([]);

  // What is that comoor now
  useEffect(() => {
    setLoading(true);
    fetchContents().then((data) => {
      setContents(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    if (loading) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contents.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [autoplay, contents.length, loading]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + contents.length) % contents.length);
    setAutoplay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % contents.length);
    setAutoplay(false);
  };

  // Show 3 products at a time with rotation
  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(contents[(currentIndex + i) % contents.length]);
    }
    return visible;
  };

  if (contents.length === 0) return null;

  const visibleProducts = getVisibleProducts();

  const getImageUrl = (value: string | string[]) => {
    try {
      if (Array.isArray(value)) return value[0];
      // If it's a string that looks like a JSON array
      if (typeof value === "string" && value.startsWith("[")) {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed[0] : value;
      }
      return value;
    } catch (e) {
      console.error("Error parsing image URL:", e);
      return value;
    }
  };

  return (
    <section className="py-14 bg-primary/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-1 text-amber-50 text-balance">
            Explore Our Collection
          </h2>
          <p className="text-lg text-amber-50 max-w-2xl mx-auto ">
            Discover the full range of Revival Glow products, each carefully
            crafted to revive and restore your hair.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-50"></div>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={`${index}-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-secondary/10">
                      <motion.img
                        src={getImageUrl(product.value) || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Badge */}

                      <div className="absolute top-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        New
                      </div>

                      {/* {product.isBestseller && !product.isNew && (
                          <div className="absolute top-3 right-3 bg-amber-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Bestseller
                          </div>
                        )} */}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* <h3 className="text-lg font-medium text-foreground mb-1 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3> */}
                        {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                            {product.description}
                          </p> */}
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < Math.floor(5) ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({25})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-amber-200 hover:bg-amber-50 transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 text-amber-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {visibleProducts.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoplay(false);
                  }}
                  className={`rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-amber-600 w-3 h-3"
                      : "bg-amber-200 w-2 h-2 hover:bg-amber-400"
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-amber-200 hover:bg-amber-50 transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 text-amber-700" />
            </button>
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="hover:bg-amber-600"
            >
              <Link href="/products">View Full Collection</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
