// hooks/useProduct.ts
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

interface UseProductReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

interface ProductFilters {
  categories?: string[];
  skinTypes?: string[];
  priceRange?: [number, number];
}

interface UseProductOptions {
  filters?: ProductFilters;
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function useProduct(options?: UseProductOptions): UseProductReturn {
  const { filters, initialPage = 1, initialItemsPerPage = 12 } = options || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query for counting total products
      let countQuery = supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Build query for fetching paginated products
      let query = supabase.from("products").select("*");

      // Apply filters to both queries
      if (filters) {
        if (filters.categories && filters.categories.length > 0) {
          query = query.in("category", filters.categories);
          countQuery = countQuery.in("category", filters.categories);
        }

        if (filters.skinTypes && filters.skinTypes.length > 0) {
          query = query.overlaps("skin_types", filters.skinTypes);
          countQuery = countQuery.overlaps("skin_types", filters.skinTypes);
        }

        if (filters.priceRange) {
          query = query
            .gte("price", filters.priceRange[0])
            .lte("price", filters.priceRange[1]);
          countQuery = countQuery
            .gte("price", filters.priceRange[0])
            .lte("price", filters.priceRange[1]);
        }
      }

      // Get total count
      const { count, error: countError } = await countQuery;
      if (countError) throw new Error(countError.message);

      const total = count || 0;
      setTotalProducts(total);
      setTotalPages(Math.ceil(total / itemsPerPage));

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      query = query.order("created_at", { ascending: false }).range(from, to);

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setProducts(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSetItemsPerPage = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Re-fetch products whenever filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [
    JSON.stringify(filters?.categories),
    JSON.stringify(filters?.skinTypes),
    JSON.stringify(filters?.priceRange),
    currentPage,
    itemsPerPage,
  ]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    currentPage,
    totalPages,
    totalProducts,
    itemsPerPage,
    setPage,
    setItemsPerPage: handleSetItemsPerPage,
  };
}
