// app/admin/orders/page.tsx
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreVertical,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  Calendar,
  User,
  MapPin,
  Package,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

// Types
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface Order {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  stripe_session_id?: string;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
  tracking_number?: string;
  carrier?: string;
}

type OrderStatus = Order["order_status"];
type PaymentStatus = Order["payment_status"];

export default function AdminOrdersPage() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        (order.tracking_number && order.tracking_number.includes(searchTerm));

      const matchesStatus =
        statusFilter === "all" || order.order_status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || order.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  // Status update handler
  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);

      const { error } = await supabase
        .from("orders")
        .update({
          order_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
      setShowStatusDialog(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Status badge variants
  const getStatusVariant = (status: OrderStatus) => {
    const variants = {
      pending: "secondary",
      processing: "default",
      shipped: "outline",
      delivered: "success",
      cancelled: "destructive",
    } as const;
    return variants[status];
  };

  const getPaymentStatusVariant = (status: PaymentStatus) => {
    const variants = {
      pending: "secondary",
      paid: "success",
      failed: "destructive",
      refunded: "outline",
    } as const;
    return variants[status];
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render order details
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
            <DialogDescription>
              Placed on {formatDate(selectedOrder.created_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">{selectedOrder.full_name}</p>
                  <p className="text-muted-foreground">{selectedOrder.email}</p>
                  <p className="text-muted-foreground">{selectedOrder.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{selectedOrder.address}</p>
                <p>
                  {selectedOrder.city}, {selectedOrder.state}{" "}
                  {selectedOrder.postal_code}
                </p>
                <p>{selectedOrder.country}</p>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              Variant: {item.variant}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrderDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Render status update dialog
  const renderStatusDialog = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the status for order #{selectedOrder.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {(
              [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ] as OrderStatus[]
            ).map((status) => (
              <Button
                key={status}
                variant={
                  selectedOrder.order_status === status ? "default" : "outline"
                }
                onClick={() => updateOrderStatus(selectedOrder.id, status)}
                disabled={updatingOrderId === selectedOrder.id}
                className="justify-start"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {updatingOrderId === selectedOrder.id && "..."}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

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
              Order Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track customer orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by name, email, ID, or tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              {filteredOrders.length} of {orders.length} orders shown
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
                      <div className="w-32 h-4 bg-muted rounded"></div>
                      <div className="w-24 h-3 bg-muted rounded"></div>
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
                        Order
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">
                        Payment
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
                      {filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-foreground">
                                #{order.id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} item
                                {order.items.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {order.full_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-foreground">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="py-4 px-4 font-semibold text-foreground">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={getPaymentStatusVariant(
                                order.payment_status
                              )}
                            >
                              {order.payment_status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant={getStatusVariant(order.order_status)}
                            >
                              {order.order_status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderDetails(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowStatusDialog(true);
                                    }}
                                  >
                                    <Truck className="w-4 h-4 mr-2" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Customer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        {renderOrderDetails()}
        {renderStatusDialog()}
      </motion.div>
    </div>
  );
}
