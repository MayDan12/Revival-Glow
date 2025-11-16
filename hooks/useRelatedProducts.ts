// hooks/useRelatedProducts.ts - Enhanced version
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

interface UseRelatedProductsReturn {
  relatedProducts: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface MatchingCriteria {
  category: string;
  skinType: string[];
}

export function useRelatedProducts(
  productId: number | string
): UseRelatedProductsReturn {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current product details
      const { data: currentProduct, error: productError } = await supabase
        .from("products")
        .select("category, skinType")
        .eq("id", productId)
        .single();

      if (productError) {
        throw new Error(productError.message);
      }

      if (!currentProduct) {
        setRelatedProducts([]);
        return;
      }

      // Fetch all potential related products (excluding current)
      const { data: allProducts, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .neq("id", productId);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!allProducts) {
        setRelatedProducts([]);
        return;
      }

      // Score and sort products by relevance
      const scoredProducts = allProducts.map((product) => ({
        product,
        score: calculateRelevanceScore(product, currentProduct),
      }));

      // Sort by score (highest first) and take top 6
      const topRelated = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((item) => item.product);

      setRelatedProducts(topRelated);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch related products"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate relevance score based on multiple factors
  const calculateRelevanceScore = (
    product: Product,
    currentProduct: MatchingCriteria
  ): number => {
    let score = 0;

    // Category match (highest weight)
    if (product.category === currentProduct.category) {
      score += 3;
    }

    // Skin type matches
    const skinTypeMatches = product.skinType.filter((type) =>
      currentProduct.skinType.includes(type)
    ).length;
    score += skinTypeMatches * 2;

    // Bonus for bestsellers and new products
    if (product.isBestseller) score += 1;
    if (product.isNew) score += 0.5;

    return score;
  };

  useEffect(() => {
    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  return {
    relatedProducts,
    loading,
    error,
    refetch: fetchRelatedProducts,
  };
}
