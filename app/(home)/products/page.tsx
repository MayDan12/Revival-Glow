"use client";

import { useState } from "react";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";

interface Filters {
  categories: string[];
  skinTypes: string[];
  priceRange: [number, number];
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    skinTypes: [],
    priceRange: [0, 200],
  });

  const {
    products,
    loading,
    error,
    refetch,
    currentPage,
    totalPages,
    totalProducts,
    itemsPerPage,
    setPage,
    setItemsPerPage,
  } = useProduct({
    filters,
    initialPage: 1,
    initialItemsPerPage: 12,
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPage(1);
  };

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-foreground  text-balance">
            {"Our Products"}
          </h1>
          <p className="md:text-lg text-muted-foreground max-w-2xl mx-auto text-relaxed">
            {
              "Discover our complete collection of premium skincare products, carefully formulated with natural ingredients for every skin type and concern."
            }
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Products</li>

            {/* <li className="text-foreground font-medium">{product.name}</li> */}
          </ol>
        </nav>

        {/* Products Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={totalProducts}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
