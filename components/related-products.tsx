"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useState } from "react";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { dispatch } = useCart();
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      },
    });

    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  if (products.length === 0) return null;

  return (
    <motion.section
      className="py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2 text-balance">
            You Might Also Love
          </h2>
          <p className="text-muted-foreground">
            Complete your routine with these complementary products
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <Link href={`/products/${product.id}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-muted aspect-square">
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {product.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                      {product.isBestseller && (
                        <Badge variant="default" className="text-xs">
                          Bestseller
                        </Badge>
                      )}
                    </div>

                    {/* Quick Add Button */}
                    <motion.div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-center pb-4"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`${
                          addedToCart === product.id ? "bg-green-600" : ""
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {addedToCart === product.id ? "Added!" : "Add to Cart"}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                      {product.category}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-foreground">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
