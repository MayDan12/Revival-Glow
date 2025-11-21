// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

// Types
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

interface RecentOrder {
  id: number;
  email: string;
  full_name: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock_quantity: number;
  min_stock_level: number;
  category: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">(
    "week"
  );

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;

      // Fetch products for stock check
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, stock_quantity, min_stock_level, category")
        .lt("stock_quantity", 10); // Low stock threshold

      if (productsError) throw productsError;

      // Calculate stats
      const totalRevenue =
        orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalOrders = orders?.length || 0;

      // Get unique customers
      const uniqueCustomers = new Set(orders?.map((order) => order.email));
      const totalCustomers = uniqueCustomers.size;

      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // For demo purposes, using mock change percentages
      // In real app, you'd compare with previous period
      const revenueChange = 12.5; // Mock data
      const ordersChange = 8.2; // Mock data
      const customersChange = 15.7; // Mock data

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        revenueChange,
        ordersChange,
        customersChange,
      });

      setRecentOrders(orders?.slice(0, 5) || []);
      setLowStockProducts(products || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      shipped: "outline",
      delivered: "default",
      cancelled: "destructive",
    } as const;
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getStatusClassName = (status: string) => {
    const classNames = {
      delivered: "bg-green-500 text-white border-green-500",
    } as const;
    return classNames[status as keyof typeof classNames] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-muted rounded mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-6 w-24 bg-muted rounded"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="h-6 w-48 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded mb-2"></div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="h-6 w-48 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded mb-2"></div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of your store performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div
                className={`flex items-center text-xs ${
                  stats.revenueChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.revenueChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(stats.revenueChange)}% from last period
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <div
                className={`flex items-center text-xs ${
                  stats.ordersChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.ordersChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(stats.ordersChange)}% from last period
              </div>
            </CardContent>
          </Card>

          {/* Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <div
                className={`flex items-center text-xs ${
                  stats.customersChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {stats.customersChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(stats.customersChange)}% from last period
              </div>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Order Value
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.averageOrderValue)}
              </div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" className="gap-2">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        #{order.id} • {order.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </p>
                      <Badge
                        variant={getStatusVariant(order.order_status)}
                        className={getStatusClassName(order.order_status)}
                      >
                        {order.order_status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No recent orders
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>Products needing restock</CardDescription>
              </div>
              <Link href="/admin/inventory">
                <Button variant="outline" size="sm" className="gap-2">
                  Manage Inventory
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">
                          {product.stock_quantity} left
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Min: {product.min_stock_level}
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    All products are well stocked
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/products/new">
                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-2"
                >
                  <Package className="w-5 h-5" />
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Manage Orders
                </Button>
              </Link>
              <Link href="/admin/inventory">
                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-2"
                >
                  <Package className="w-5 h-5" />
                  View Inventory
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button
                  variant="outline"
                  className="w-full h-16 flex-col gap-2"
                >
                  <Users className="w-5 h-5" />
                  Customers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// "use client";

// import ActivityFeed from "@/components/admin/dashboard/activity-feed";
// import CustomerAnalytics from "@/components/admin/dashboard/customer-analytics";
// import FinancialWidgets from "@/components/admin/dashboard/financial-widgets";
// import OverviewStats from "@/components/admin/dashboard/overview-stats";
// import RecentOrders from "@/components/admin/dashboard/recent-orders";
// import {
//   RevenueChart,
//   SalesChart,
// } from "@/components/admin/dashboard/sales-chart";
// import TopProducts from "@/components/admin/dashboard/top-products";

// // import OverviewStats from "./overview-stats";
// // import { SalesChart, RevenueChart } from "./sales-chart";
// // import RecentOrders from "./recent-orders";
// // import TopProducts from "./top-products";
// // import CustomerAnalytics from "./customer-analytics";
// // import ActivityFeed from "./activity-feed";
// // import FinancialWidgets from "./financial-widgets";

// export default function DashboardContent() {
//   return (
//     <div className="space-y-4 sm:space-y-6 w-full min-w-0">
//       {/* Overview Stats */}
//       <OverviewStats />

//       {/* Charts Row - Stack on mobile, side by side on desktop */}
//       <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
//         <div className="w-full min-w-0">
//           <SalesChart />
//         </div>
//         <div className="w-full min-w-0">
//           <RevenueChart />
//         </div>
//       </div>

//       {/* Main Content Grid - Stack on mobile, responsive grid on larger screens */}
//       <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
//         {/* Left Column - Full width on mobile, 2/3 width on desktop */}
//         <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
//           <RecentOrders />
//           <TopProducts />
//         </div>

//         {/* Right Column - Full width on mobile, 1/3 width on desktop */}
//         <div className="space-y-4 sm:space-y-6 w-full min-w-0">
//           <CustomerAnalytics />
//           <ActivityFeed />
//         </div>
//       </div>

//       {/* Financial Overview Section */}
//       {/* <div className="mt-6 sm:mt-8">
//         <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-1">
//           Financial Overview
//         </h2>
//         <FinancialWidgets />
//       </div> */}
//     </div>
//   );
// }
