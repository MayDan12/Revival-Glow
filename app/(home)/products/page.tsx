"use client";

import { useState } from "react";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { useProduct } from "@/hooks/useProduct";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

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

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Calculate filtered products
  const filteredProducts = products.filter((product) => {
    const priceMatch =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    return priceMatch && categoryMatch;
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
    setIsFiltersOpen(false);
  };

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 ">
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

        {/* Mobile Filter Button */}
        <div className="mb-6 md:hidden flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} products
          </p>
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent hover:bg-primary/60"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ProductFilters
                  onFiltersChange={handleFiltersChange}
                  initialFilters={filters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products Layout */}
        <div className="grid grid-cols-1  md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden md:block">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <ProductGrid
              products={filteredProducts}
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
