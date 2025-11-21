// app/admin/shipment/page.tsx
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Send,
  MapPin,
  User,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

// Types
interface ShippingOrder {
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
  order_status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status: string;
  items: any[];
  created_at: string;
  shipping_method?: string;
  tracking_number?: string;
  carrier?: string;
  shipping_label_url?: string;
  estimated_delivery?: string;
}

interface Carrier {
  id: string;
  name: string;
  service: string;
  price: number;
  estimated_days: number;
}

interface BulkAction {
  orderIds: number[];
  action: "mark_shipped" | "print_labels" | "update_tracking";
}

export default function ShipmentManagement() {
  // State
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("processing");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(
    null
  );
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [fulfillingOrderId, setFulfillingOrderId] = useState<number | null>(
    null
  );

  // Mock carriers - in real app, you'd fetch from shipping API
  const mockCarriers: Carrier[] = [
    {
      id: "usps_priority",
      name: "USPS",
      service: "Priority Mail",
      price: 895,
      estimated_days: 2,
    },
    {
      id: "usps_first_class",
      name: "USPS",
      service: "First Class",
      price: 495,
      estimated_days: 3,
    },
    {
      id: "ups_ground",
      name: "UPS",
      service: "Ground",
      price: 1295,
      estimated_days: 5,
    },
    {
      id: "ups_2day",
      name: "UPS",
      service: "2nd Day Air",
      price: 2495,
      estimated_days: 2,
    },
    {
      id: "fedex_ground",
      name: "FedEx",
      service: "Ground",
      price: 1195,
      estimated_days: 4,
    },
    {
      id: "fedex_2day",
      name: "FedEx",
      service: "2Day",
      price: 2295,
      estimated_days: 2,
    },
  ];

  useEffect(() => {
    fetchOrders();
    setCarriers(mockCarriers);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("order_status", ["pending", "processing"]) // Only show unfulfilled orders
        .order("created_at", { ascending: true });

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

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Fulfillment stats
  const fulfillmentStats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.order_status === "pending").length;
    const processing = orders.filter(
      (o) => o.order_status === "processing"
    ).length;
    const readyToShip = orders.filter(
      (o) => o.order_status === "processing" && o.payment_status === "paid"
    ).length;

    return { totalOrders, pending, processing, readyToShip };
  }, [orders]);

  // Generate tracking number
  const generateTrackingNumber = (carrier: string) => {
    const prefixes = {
      usps: "94",
      ups: "1Z",
      fedex: "",
    };

    const prefix = prefixes[carrier as keyof typeof prefixes] || "";
    const random = Math.random().toString(36).substr(2, 15).toUpperCase();
    return `${prefix}${random}`;
  };

  // Fulfill order
  const fulfillOrder = async (orderId: number) => {
    try {
      setFulfillingOrderId(orderId);

      if (!selectedCarrier) {
        toast.error("Please select a shipping carrier");
        return;
      }

      const carrier = carriers.find((c) => c.id === selectedCarrier);
      if (!carrier) return;

      const tracking =
        trackingNumber || generateTrackingNumber(carrier.name.toLowerCase());
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(
        estimatedDelivery.getDate() + carrier.estimated_days
      );

      const { error } = await supabase
        .from("orders")
        .update({
          order_status: "shipped",
          tracking_number: tracking,
          carrier: carrier.name,
          shipping_method: carrier.service,
          estimated_delivery: estimatedDelivery.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_status: "shipped" as const,
                tracking_number: tracking,
                carrier: carrier.name,
                shipping_method: carrier.service,
                estimated_delivery: estimatedDelivery.toISOString(),
              }
            : order
        )
      );

      // In a real app, you would:
      // 1. Generate shipping label via API
      // 2. Send tracking email to customer
      // 3. Update inventory

      toast.success(`Order #${orderId} marked as shipped`);
      setShowFulfillment(false);
      setSelectedCarrier("");
      setTrackingNumber("");

      // Simulate label generation
      setTimeout(() => {
        toast.info(`Shipping label generated for order #${orderId}`);
      }, 1000);
    } catch (error) {
      console.error("Error fulfilling order:", error);
      toast.error("Failed to fulfill order");
    } finally {
      setFulfillingOrderId(null);
    }
  };

  // Bulk fulfill orders
  const bulkFulfillOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders to fulfill");
      return;
    }

    try {
      // For demo, we'll use the first selected carrier for all orders
      // In real app, you might want individual carrier selection
      const carrier = carriers.find((c) => c.id === selectedCarrier);
      if (!carrier) {
        toast.error("Please select a shipping carrier");
        return;
      }

      const updates = selectedOrders.map((orderId) => ({
        id: orderId,
        order_status: "shipped" as const,
        tracking_number: generateTrackingNumber(carrier.name.toLowerCase()),
        carrier: carrier.name,
        shipping_method: carrier.service,
        estimated_delivery: new Date(
          Date.now() + carrier.estimated_days * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Update database
      for (const update of updates) {
        const { error } = await supabase
          .from("orders")
          .update(update)
          .eq("id", update.id);

        if (error) throw error;
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) => {
          const update = updates.find((u) => u.id === order.id);
          return update ? { ...order, ...update } : order;
        })
      );

      toast.success(`Successfully shipped ${selectedOrders.length} orders`);
      setShowBulkActions(false);
      setSelectedOrders([]);
      setSelectedCarrier("");
    } catch (error) {
      console.error("Error in bulk fulfillment:", error);
      toast.error("Failed to fulfill orders");
    }
  };

  // Print shipping labels
  const printShippingLabels = async (orderIds: number[]) => {
    try {
      // Simulate label generation
      toast.info(`Generating ${orderIds.length} shipping labels...`);

      // In real app, you would:
      // 1. Call shipping API to generate labels
      // 2. Return PDF URLs
      // 3. Open print dialog or download

      setTimeout(() => {
        toast.success(`Shipping labels ready for ${orderIds.length} orders`);
        // Here you would typically open the PDF in a new window
        window.open(
          `/api/shipping/labels?orders=${orderIds.join(",")}`,
          "_blank"
        );
      }, 2000);
    } catch (error) {
      console.error("Error printing labels:", error);
      toast.error("Failed to generate shipping labels");
    }
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all filtered orders
  const selectAllOrders = () => {
    setSelectedOrders(filteredOrders.map((order) => order.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedOrders([]);
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        label: "Pending",
        variant: "secondary" as const,
        className: "",
      },
      processing: {
        label: "Processing",
        variant: "default" as const,
        className: "",
      },
      shipped: {
        label: "Shipped",
        variant: "outline" as const,
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      delivered: {
        label: "Delivered",
        variant: "default" as const,
        className: "bg-green-50 text-green-700 border-green-200",
      },
      cancelled: {
        label: "Cancelled",
        variant: "destructive" as const,
        className: "",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
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
              Shipment Management
            </h1>
            <p className="text-muted-foreground">
              Fulfill orders and manage shipping
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchOrders} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            {selectedOrders.length > 0 && (
              <Button
                onClick={() => setShowBulkActions(true)}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Bulk Actions ({selectedOrders.length})
              </Button>
            )}
          </div>
        </div>

        {/* Fulfillment Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {fulfillmentStats.totalOrders}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total to Fulfill
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {fulfillmentStats.pending}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {fulfillmentStats.processing}
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {fulfillmentStats.readyToShip}
                </p>
                <p className="text-sm text-muted-foreground">Ready to Ship</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by name, email, or tracking..."
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllOrders}
                    disabled={filteredOrders.length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    disabled={selectedOrders.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    printShippingLabels(
                      selectedOrders.length > 0
                        ? selectedOrders
                        : filteredOrders.map((o) => o.id)
                    )
                  }
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print Labels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Orders Ready for Fulfillment ({filteredOrders.length})
            </CardTitle>
            <CardDescription>
              {selectedOrders.length > 0 &&
                `${selectedOrders.length} orders selected`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Skeleton loader
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectAllOrders();
                            } else {
                              clearSelection();
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Shipping Address</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => toggleOrderSelection(order.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">#{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.phone}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <p className="text-sm">{order.address}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.city}, {order.state} {order.postal_code}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.order_status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span>{order.items.length} items</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowFulfillment(true);
                                }}
                                disabled={order.order_status === "shipped"}
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                {order.order_status === "shipped"
                                  ? "Shipped"
                                  : "Fulfill"}
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fulfillment Dialog */}
        <Dialog open={showFulfillment} onOpenChange={setShowFulfillment}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fulfill Order #{selectedOrder?.id}</DialogTitle>
              <DialogDescription>
                Ship order to {selectedOrder?.full_name}
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">
                        {selectedOrder.full_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span>{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Address:</span>
                      <span className="text-right">
                        {selectedOrder.address}
                        <br />
                        {selectedOrder.city}, {selectedOrder.state}{" "}
                        {selectedOrder.postal_code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{selectedOrder.items.length} products</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Options */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Shipping Carrier
                    </label>
                    <Select
                      value={selectedCarrier}
                      onValueChange={setSelectedCarrier}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        {carriers.map((carrier) => (
                          <SelectItem key={carrier.id} value={carrier.id}>
                            {carrier.name} {carrier.service} -{" "}
                            {formatCurrency(carrier.price)}(
                            {carrier.estimated_days} days)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Tracking Number
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Auto-generate or enter custom"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (selectedCarrier) {
                            const carrier = carriers.find(
                              (c) => c.id === selectedCarrier
                            );
                            if (carrier) {
                              setTrackingNumber(
                                generateTrackingNumber(
                                  carrier.name.toLowerCase()
                                )
                              );
                            }
                          }
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowFulfillment(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedOrder && fulfillOrder(selectedOrder.id)}
                disabled={
                  !selectedCarrier || fulfillingOrderId === selectedOrder?.id
                }
              >
                {fulfillingOrderId === selectedOrder?.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Mark as Shipped
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Actions Dialog */}
        <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Fulfillment</DialogTitle>
              <DialogDescription>
                Ship {selectedOrders.length} orders with same carrier
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Shipping Carrier</label>
                <Select
                  value={selectedCarrier}
                  onValueChange={setSelectedCarrier}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier for all orders" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.name} {carrier.service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Selected Orders:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {selectedOrders.map((orderId) => {
                    const order = orders.find((o) => o.id === orderId);
                    return order ? (
                      <div
                        key={orderId}
                        className="text-sm flex justify-between"
                      >
                        <span>
                          #{orderId} - {order.full_name}
                        </span>
                        <span className="text-muted-foreground">
                          {order.items.length} items
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => printShippingLabels(selectedOrders)}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Print Labels Only
              </Button>
              <Button
                onClick={bulkFulfillOrders}
                disabled={!selectedCarrier}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Ship All Orders
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
