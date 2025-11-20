"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trash2, Edit2, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

// Constants
const DEBOUNCE_DELAY = 300;

// Types
interface DeleteState {
  id: number | null;
  showConfirm: boolean;
}

export default function AdminProductsListPage() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteState, setDeleteState] = useState<DeleteState>({
    id: null,
    showConfirm: false,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Data fetching
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProducts(data || []);
      } catch (err) {
        console.error("Fetch products error:", err);
        const errorMessage = "Unable to fetch products. Please reload.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized derived data
  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedSearchTerm, categoryFilter]);

  // Event handlers
  const handleDeleteInit = useCallback((id: number) => {
    setDeleteState({ id, showConfirm: true });
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteState({ id: null, showConfirm: false });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteState.id) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteState.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteState.id)
      );
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Unable to delete product, please try again");
    } finally {
      setDeleteState({ id: null, showConfirm: false });
    }
  }, [deleteState.id]);

  // Render helpers
  const renderSkeletonLoader = () =>
    [...Array(5)].map((_, i) => (
      <tr key={i} className="border-b border-border animate-pulse">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded" />
            <div>
              <div className="w-24 h-3 bg-muted rounded mb-2" />
              <div className="w-16 h-3 bg-muted rounded" />
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="w-20 h-3 bg-muted rounded" />
        </td>
        <td className="py-4 px-4">
          <div className="w-12 h-3 bg-muted rounded" />
        </td>
        <td className="py-4 px-4">
          <div className="w-16 h-3 bg-muted rounded" />
        </td>
        <td className="py-4 px-4 text-right">
          <div className="w-12 h-3 bg-muted rounded ml-auto" />
        </td>
      </tr>
    ));

  const renderProductRow = (product: Product, index: number) => (
    <motion.tr
      key={product.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border hover:bg-muted/50 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-medium font-serif text-foreground line-clamp-1">
              {product.name}
            </p>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-foreground capitalize">
        {product.category}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2 flex-wrap">
          {product.stock_quantity > 0 ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
              In Stock ({product.stock_quantity})
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap">
              Out of Stock
            </span>
          )}
        </div>
      </td>
      {/* <td className="py-4 px-4">
        <div className="flex gap-2 flex-wrap">
          {product.isNew && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full whitespace-nowrap">
              Bestseller
            </span>
          )}
        </div>
      </td> */}
      <td className="py-4 px-4">
        <div className="flex justify-end gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={() => handleDeleteInit(product.id!)}
            disabled={deleteState.id === product.id}
          >
            <Trash2 className="w-4 h-4" />
            {deleteState.id === product.id ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </td>
    </motion.tr>
  );

  const renderEmptyState = () => (
    <tr>
      <td colSpan={5} className="py-8 px-4 text-center">
        <div className="text-muted-foreground">
          {products.length === 0
            ? "No products found"
            : "No products match your filters"}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
              Manage Products
            </h1>
            <p className="text-muted-foreground">
              View, edit, and delete products from your Revival Glow catalog
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive text-center">
                {error}
                <Button
                  variant="outline"
                  className="ml-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <CardDescription>
              {filteredProducts.length} of {products.length} products shown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-serif py-3 px-4 font-semibold text-foreground">
                      Product
                    </th>
                    <th className="text-left font-serif py-3 px-4 font-semibold text-foreground">
                      Category
                    </th>
                    <th className="text-left font-serif py-3 px-4 font-semibold text-foreground">
                      Price
                    </th>
                    <th className="text-left font-serif py-3 px-4 font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="text-right font-serif py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    renderSkeletonLoader()
                  ) : (
                    <AnimatePresence>
                      {filteredProducts.length > 0
                        ? filteredProducts.map(renderProductRow)
                        : renderEmptyState()}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteState.showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={handleDeleteCancel}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-lg p-6 max-w-sm w-full shadow-lg"
              >
                <h2 className="text-xl font-serif text-foreground mb-2">
                  Delete Product?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={handleDeleteCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deleteState.id === null}
                  >
                    {deleteState.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
