"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { easeOut, motion } from "framer-motion";
import { useProduct } from "@/hooks/useProduct";
import { Product } from "@/types/product";

export function FeaturedProducts() {
  const { products, loading, error } = useProduct();

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
      transition: { duration: 0.6, ease: easeOut },
    },
  };
  return (
    <section className="py-10 bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-gray-700 mb-4 text-balance">
            {"Featured Products"}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto text-balance">
            {
              "Discover our most loved skincare essentials, carefully formulated with natural ingredients for radiant, healthy skin."
            }
          </p>
        </motion.div>

        {/* loading with skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 rounded-lg h-64"
              ></div>
            ))}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-8"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <FeaturedProduct product={product} key={product.id} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="hover:bg-primary"
            variant="outline"
          >
            <Link href="/products">{"View All Products"}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProduct({ product }: { product: Product }) {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images ? product.images[0] : product.images,
      },
    });
    // Reset quantity after adding to cart
  };

  return (
    <Card
      key={product.id}
      className="group py-0 cursor-pointer bg-white border-0 shadow-sm hover:shadow-md transition-shadow"
    >
      <CardContent className="p-0 ">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.images[0] ? product.images[0] : "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <Link href={`/products/${product.id}`} key={product.id}>
            <h3 className="text-lg font-serif font-medium text-foreground mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className=" font-medium text-foreground">
              ${product.price}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={addToCart}
              className="hover:bg-primary"
            >
              {"Add to Cart"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
