"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/cart-context";
import { Heart, ShoppingCart, Minus, Plus, Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  category: string;
  skin_types?: string[];
  ingredients?: string[];
  how_to_use?: string;
  benefits?: string[];
  is_new?: boolean;
  is_bestseller?: boolean;
  rating?: number;
  review_count?: number;
  images: string[];
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { dispatch } = useCart();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      },
    });
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  // Default values for optional fields
  const skinTypes = product.skin_types || [];
  const ingredients = product.ingredients || [];
  const benefits = product.benefits || [];
  const howToUse = product.how_to_use || "Apply as directed on the packaging.";
  const rating = product.rating || 5;
  const reviewCount = product.review_count || 0;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.is_new && <Badge variant="secondary">New</Badge>}
          {product.is_bestseller && <Badge variant="default">Bestseller</Badge>}
          <Badge variant="outline">{product.category}</Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4 text-balance">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-medium text-foreground">
              ${product.price}
            </span>
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.original_price}
              </span>
            )}
          </div>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                ({reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Skin Types */}
      {skinTypes.length > 0 && (
        <div>
          <h3 className="font-medium text-foreground mb-2">Suitable for:</h3>
          <div className="flex flex-wrap gap-2">
            {skinTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={decreaseQuantity}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={increaseQuantity}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className="h-10 w-10 p-0"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>

          <Button size="lg" className="w-full" onClick={addToCart}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>
        </CardContent>
      </Card>

      {/* Product Information Tabs */}
      <Tabs defaultValue="benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="usage">How to Use</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-2">Key Benefits</h3>
              {benefits.length > 0 ? (
                <ul className="space-y-1">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-primary mt-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No benefits information available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingredients" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-2">
                Key Ingredients
              </h3>
              {ingredients.length > 0 ? (
                <div className="space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="text-muted-foreground">
                      {ingredient.includes(":") ? (
                        <>
                          <span className="font-medium text-foreground">
                            {ingredient.split(":")[0]}:
                          </span>
                          <span className="ml-1">
                            {ingredient.split(":")[1]}
                          </span>
                        </>
                      ) : (
                        <span>• {ingredient}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No ingredients information available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-2">How to Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                {howToUse}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
