// // hooks/useProduct.ts
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/utils/supabase/client";
// import { Product } from "@/types/product";

// interface UseProductReturn {
//   products: Product[];
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
//   // Pagination
//   currentPage: number;
//   totalPages: number;
//   totalProducts: number;
//   itemsPerPage: number;
//   setPage: (page: number) => void;
//   setItemsPerPage: (items: number) => void;
// }

// interface ProductFilters {
//   categories?: string[];
//   skinTypes?: string[];
//   priceRange?: [number, number];
// }

// interface UseProductOptions {
//   filters?: ProductFilters;
//   initialPage?: number;
//   initialItemsPerPage?: number;
// }

// export function useProduct(options?: UseProductOptions): UseProductReturn {
//   const { filters, initialPage = 1, initialItemsPerPage = 12 } = options || {};

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Build query for counting total products
//       let countQuery = supabase
//         .from("products")
//         .select("*", { count: "exact", head: true });

//       // Build query for fetching paginated products
//       let query = supabase.from("products").select("*");

//       // Apply filters to both queries
//       if (filters) {
//         if (filters.categories && filters.categories.length > 0) {
//           query = query.in("category", filters.categories);
//           countQuery = countQuery.in("category", filters.categories);
//         }

//         if (filters.skinTypes && filters.skinTypes.length > 0) {
//           query = query.overlaps("skin_types", filters.skinTypes);
//           countQuery = countQuery.overlaps("skin_types", filters.skinTypes);
//         }

//         if (filters.priceRange) {
//           query = query
//             .gte("price", filters.priceRange[0])
//             .lte("price", filters.priceRange[1]);
//           countQuery = countQuery
//             .gte("price", filters.priceRange[0])
//             .lte("price", filters.priceRange[1]);
//         }
//       }

//       // Get total count
//       const { count, error: countError } = await countQuery;
//       if (countError) throw new Error(countError.message);

//       const total = count || 0;
//       setTotalProducts(total);
//       setTotalPages(Math.ceil(total / itemsPerPage));

//       // Apply pagination
//       const from = (currentPage - 1) * itemsPerPage;
//       const to = from + itemsPerPage - 1;

//       query = query.order("created_at", { ascending: false }).range(from, to);

//       const { data, error: supabaseError } = await query;

//       if (supabaseError) {
//         throw new Error(supabaseError.message);
//       }

//       setProducts(data || []);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchProductById = async (id: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data, error: supabaseError } = await supabase
//         .from("products")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (supabaseError) {
//         throw new Error(supabaseError.message);
//       }

//       setProducts(data);
//     } catch (err) {
//       console.error("Error fetching product:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleSetItemsPerPage = (items: number) => {
//     setItemsPerPage(items);
//     setCurrentPage(1); // Reset to first page when changing items per page
//   };

//   // Re-fetch products whenever filters or pagination changes
//   useEffect(() => {
//     fetchProducts();
//   }, [
//     JSON.stringify(filters?.categories),
//     JSON.stringify(filters?.skinTypes),
//     JSON.stringify(filters?.priceRange),
//     currentPage,
//     itemsPerPage,
//   ]);

//   return {
//     products,
//     loading,
//     error,
//     refetch: fetchProducts,
//     currentPage,
//     totalPages,
//     totalProducts,
//     itemsPerPage,
//     setPage,
//     setItemsPerPage: handleSetItemsPerPage,
//   };
// }
// hooks/useProduct.ts
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

// Constants
const DEFAULT_ITEMS_PER_PAGE = 12;
const DEFAULT_PAGE = 1;
const DEBOUNCE_DELAY = 300;

// Types
interface ProductFilters {
  categories?: string[];
  skinTypes?: string[];
  priceRange?: [number, number];
}

interface UseProductOptions {
  filters?: ProductFilters;
  initialPage?: number;
  initialItemsPerPage?: number;
  enabled?: boolean;
  debounceDelay?: number;
}

interface UseProductReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  // Utilities
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  fetchProductById: (id: number) => Promise<void>;
}

// Cache mechanism
const queryCache = new Map<
  string,
  { data: Product[]; timestamp: number; count: number }
>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function generateCacheKey(
  filters: ProductFilters | undefined,
  currentPage: number,
  itemsPerPage: number
): string {
  return JSON.stringify({
    filters,
    page: currentPage,
    limit: itemsPerPage,
  });
}

export function useProduct(options: UseProductOptions = {}): UseProductReturn {
  const {
    filters,
    initialPage = DEFAULT_PAGE,
    initialItemsPerPage = DEFAULT_ITEMS_PER_PAGE,
    enabled = true,
    debounceDelay = DEBOUNCE_DELAY,
  } = options;

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalProducts, setTotalProducts] = useState(0);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state
  const totalPages = useMemo(
    () => Math.ceil(totalProducts / itemsPerPage) || 1,
    [totalProducts, itemsPerPage]
  );

  const hasNextPage = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages]
  );

  const hasPreviousPage = useMemo(() => currentPage > 1, [currentPage]);

  // Memoized filter dependencies for effect triggers
  const filterDependencies = useMemo(() => {
    return {
      categories: filters?.categories?.join(",") || "",
      skinTypes: filters?.skinTypes?.join(",") || "",
      priceRange: filters?.priceRange?.join(",") || "",
    };
  }, [filters]);

  // Main data fetching function
  const fetchProducts = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const cacheKey = generateCacheKey(filters, currentPage, itemsPerPage);
      const cached = queryCache.get(cacheKey);

      // Return cached data if valid
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setProducts(cached.data);
        setTotalProducts(cached.count);
        return;
      }

      // Build base queries
      let query = supabase.from("products").select("*");
      let countQuery = supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Apply filters
      if (filters?.categories?.length) {
        query = query.in("category", filters.categories);
        countQuery = countQuery.in("category", filters.categories);
      }

      if (filters?.skinTypes?.length) {
        query = query.overlaps("skin_types", filters.skinTypes);
        countQuery = countQuery.overlaps("skin_types", filters.skinTypes);
      }

      if (filters?.priceRange) {
        const [min, max] = filters.priceRange;
        query = query.gte("price", min).lte("price", max);
        countQuery = countQuery.gte("price", min).lte("price", max);
      }

      // Execute count query first
      const { count, error: countError } = await countQuery;

      if (countError) throw new Error(countError.message);

      const totalCount = count || 0;
      setTotalProducts(totalCount);

      // Validate current page
      const validatedPage = Math.max(
        1,
        Math.min(currentPage, Math.ceil(totalCount / itemsPerPage))
      );
      if (validatedPage !== currentPage) {
        setCurrentPage(validatedPage);
        return;
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error: dataError } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (dataError) throw new Error(dataError.message);

      const productsData = data || [];

      // Update cache
      queryCache.set(cacheKey, {
        data: productsData,
        count: totalCount,
        timestamp: Date.now(),
      });

      setProducts(productsData);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === "AbortError") return;

      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage, enabled]);

  // Individual product fetch
  const fetchProductById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (supabaseError) throw new Error(supabaseError.message);

      setProducts(data ? [data] : []);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, []);

  // Pagination handlers
  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  const handleSetItemsPerPage = useCallback((items: number) => {
    const validItems = Math.max(1, items);
    setItemsPerPage(validItems);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Debounced refetch
  const debouncedRefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchProducts();
    }, debounceDelay);
  }, [fetchProducts, debounceDelay]);

  // Effects
  useEffect(() => {
    debouncedRefetch();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedRefetch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterDependencies]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    currentPage,
    totalPages,
    totalProducts,
    itemsPerPage,
    fetchProductById,
    setPage,
    setItemsPerPage: handleSetItemsPerPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  };
}

// Specialized hook variants
export function useProductById(id: number) {
  const hook = useProduct({ enabled: false });
  const { fetchProductById } = hook;

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  return hook;
}

export function useProductsByCategory(
  category: string,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE
) {
  return useProduct({
    filters: { categories: [category] },
    initialItemsPerPage: itemsPerPage,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useProduct({
    initialItemsPerPage: limit,
    filters: {
      /* Add featured filter logic */
    },
  });
}
