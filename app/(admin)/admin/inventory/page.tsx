// app/admin/inventory/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle,
  Edit,
  Plus,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

// Types
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  min_stock_level: number;
  status: "active" | "inactive";
  created_at: string;
}

interface StockUpdate {
  productId: number;
  newQuantity: number;
  reason: string;
}

export default function InventoryManagement() {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showStockUpdate, setShowStockUpdate] = useState(false);
  const [newStockQuantity, setNewStockQuantity] = useState("");
  const [updateReason, setUpdateReason] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(
    null
  );

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("stock_quantity", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "low"
          ? product.stock_quantity <= product.min_stock_level
          : stockFilter === "out"
          ? product.stock_quantity === 0
          : stockFilter === "in_stock"
          ? product.stock_quantity > 0
          : true;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  // Get categories
  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products]
  );

  // Stock status
  const getStockStatus = (product: Product) => {
    if (product.stock_quantity === 0) {
      return {
        status: "Out of Stock",
        variant: "destructive" as const,
        className: "bg-red-500 text-white",
      };
    } else if (product.stock_quantity <= product.min_stock_level) {
      return {
        status: "Low Stock",
        variant: "outline" as const,
        className: "bg-amber-100 text-amber-800 border-amber-300",
      };
    } else {
      return {
        status: "In Stock",
        variant: "outline" as const,
        className: "bg-green-100 text-green-800 border-green-300",
      };
    }
  };

  // Update stock quantity
  const updateStockQuantity = async () => {
    if (!selectedProduct || !newStockQuantity) return;

    try {
      setUpdatingProductId(selectedProduct.id);

      const newQuantity = parseInt(newStockQuantity);
      if (isNaN(newQuantity)) {
        toast.error("Please enter a valid number");
        return;
      }

      const { error } = await supabase
        .from("products")
        .update({
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // Update local state
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, stock_quantity: newQuantity }
            : product
        )
      );

      toast.success(`Stock updated for ${selectedProduct.name}`);
      setShowStockUpdate(false);
      setNewStockQuantity("");
      setUpdateReason("");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock");
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Bulk stock update (simple version)
  const handleBulkStockUpdate = async (increment: number) => {
    try {
      const updates = products.map((product) => ({
        id: product.id,
        stock_quantity: Math.max(0, product.stock_quantity + increment),
      }));

      // In a real app, you'd batch update the database

      // For now, we'll update locally
      setProducts((prev) =>
        prev.map((product) => {
          const update = updates.find((u) => u.id === product.id);
          return update
            ? { ...product, stock_quantity: update.stock_quantity }
            : product;
        })
      );

      toast.success(
        `Stock levels ${
          increment >= 0 ? "increased" : "decreased"
        } by ${Math.abs(increment)}`
      );
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to update stock levels");
    }
  };

  // Export inventory data
  const exportInventory = () => {
    const csvContent = [
      [
        "ID",
        "SKU",
        "Name",
        "Category",
        "Price",
        "Stock",
        "Min Stock",
        "Status",
      ],
      ...filteredProducts.map((p) => [
        p.id,
        p.sku,
        p.name,
        p.category,
        `$${p.price}`,
        p.stock_quantity,
        p.min_stock_level,
        getStockStatus(p).status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Inventory data exported");
  };

  // Stats
  const inventoryStats = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter((p) => p.stock_quantity === 0).length;
    const lowStock = products.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_level
    ).length;
    const inStock = products.filter(
      (p) => p.stock_quantity > p.min_stock_level
    ).length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.stock_quantity,
      0
    );

    return { totalProducts, outOfStock, lowStock, inStock, totalValue };
  }, [products]);

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
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Manage product stock levels and inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={exportInventory}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button onClick={fetchProducts} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {inventoryStats.totalProducts}
                </p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {inventoryStats.inStock}
                </p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {inventoryStats.lowStock}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {inventoryStats.outOfStock}
                </p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${(inventoryStats.totalValue / 100).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => handleBulkStockUpdate(10)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add 10 to All
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStockUpdate(-10)}
                className="gap-2"
              >
                <Package className="w-4 h-4" />
                Remove 10 from All
              </Button>
              <div className="flex-1"></div>
              <Link href="/admin/products/new">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Product
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
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
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
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
            {loading ? (
              // Skeleton loader
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-border p-4 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="w-48 h-4 bg-muted rounded"></div>
                      <div className="w-32 h-3 bg-muted rounded"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded"></div>
                    <div className="w-24 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Stock Level
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => {
                        const stockStatus = getStockStatus(product);
                        return (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-foreground">
                                  {product.name}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-foreground capitalize">
                              {product.category}
                            </td>
                            <td className="py-4 px-4 font-semibold text-foreground">
                              ${product.price}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {product.stock_quantity}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  / min {product.min_stock_level}
                                </span>
                                {product.stock_quantity <=
                                  product.min_stock_level && (
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant={stockStatus.variant}
                                className={stockStatus.className}
                              >
                                {stockStatus.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setNewStockQuantity(
                                      product.stock_quantity.toString()
                                    );
                                    setShowStockUpdate(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                  Update Stock
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Update Dialog */}
        <Dialog open={showStockUpdate} onOpenChange={setShowStockUpdate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Stock Level</DialogTitle>
              <DialogDescription>
                Update inventory for {selectedProduct?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Stock</label>
                <p className="text-lg font-semibold">
                  {selectedProduct?.stock_quantity} units
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  New Stock Quantity
                </label>
                <Input
                  type="number"
                  value={newStockQuantity}
                  onChange={(e) => setNewStockQuantity(e.target.value)}
                  placeholder="Enter new quantity"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Reason for Update</label>
                <Select value={updateReason} onValueChange={setUpdateReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restock">Restock</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="damaged">Damaged Goods</SelectItem>
                    <SelectItem value="return">Customer Return</SelectItem>
                    <SelectItem value="adjustment">
                      Inventory Adjustment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStockUpdate(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={updateStockQuantity}
                disabled={
                  updatingProductId === selectedProduct?.id || !newStockQuantity
                }
              >
                {updatingProductId === selectedProduct?.id
                  ? "Updating..."
                  : "Update Stock"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
