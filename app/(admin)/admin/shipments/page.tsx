// app/admin/shipments/page.tsx
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
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

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
    | "label_created"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status: string;
  items: any[];
  created_at: string;
  /** Populated from shipments join */
  shipment?: {
    id: string;
    external_shipment_id: string | null;
    tracking_number: string | null;
    label_url: string | null;
    service_name: string | null;
    shipping_cost: number | null;
    status: string;
  } | null;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function ShipmentManagement() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("processing");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ── Fetch orders with their shipments ─────────────────────────────────

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .not("payment_status", "eq", "pending")
        .not("order_status", "in", '("cancelled","delivered")')
        .order("created_at", { ascending: true });

      if (error) throw error;

      const orderList = data || [];
      const orderIds = orderList.map((o: any) => o.id);

      // Load associated shipments
      let shipmentsMap: Record<number, any> = {};
      if (orderIds.length > 0) {
        const { data: shipments } = await supabase
          .from("shipments")
          .select("*")
          .in("order_id", orderIds);

        (shipments || []).forEach((s: any) => {
          shipmentsMap[s.order_id] = s;
        });
      }

      setOrders(
        orderList.map((o: any) => ({
          ...o,
          items: o.items ?? [],
          shipment: shipmentsMap[o.id] ?? null,
        })),
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Filtered orders ───────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        order.shipment?.tracking_number?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || order.order_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // ── Stats ─────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = orders.length;
    const awaitingShipment = orders.filter(
      (o) => o.payment_status === "paid" && !o.shipment?.external_shipment_id,
    ).length;
    const labelCreated = orders.filter(
      (o) => o.shipment?.label_url && !o.shipment?.tracking_number,
    ).length;
    const shipped = orders.filter((o) => o.order_status === "shipped").length;
    return { total, awaitingShipment, labelCreated, shipped };
  }, [orders]);

  // ── Action: Create Chit Chats shipment ────────────────────────────────

  const createShipment = async (orderId: number) => {
    try {
      setActionLoading(orderId);

      const res = await fetch("/api/shipping/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 409 = already exists — not really an error
        if (res.status === 409) {
          toast.info("Shipment already created for this order.");
        } else {
          throw new Error(data.error || "Failed to create shipment");
        }
      } else {
        toast.success(`Shipment created in Chit Chats for order #${orderId}`);
      }

      await fetchOrders();
      setShowFulfillment(false);
    } catch (error: any) {
      console.error("createShipment error:", error);
      toast.error(error.message || "Failed to create shipment");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Action: Buy label ─────────────────────────────────────────────────

  const buyLabel = async (orderId: number) => {
    try {
      setActionLoading(orderId);

      const res = await fetch("/api/shipping/buy-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to buy label");
      }

      toast.success(
        `Label purchased! Tracking: ${data.trackingNumber ?? "assigned by carrier"}`,
      );
      await fetchOrders();
      setShowFulfillment(false);
    } catch (error: any) {
      console.error("buyLabel error:", error);
      toast.error(error.message || "Failed to buy label");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatCurrency = (amount: number) => {
    // amounts stored in cents
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (order: ShippingOrder) => {
    const status = order.order_status;
    const hasShipment = !!order.shipment?.external_shipment_id;
    const hasLabel = !!order.shipment?.label_url;
    const hasTracking = !!order.shipment?.tracking_number;

    if (status === "delivered") {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 border">
          <CheckCircle className="w-3 h-3 mr-1" /> Delivered
        </Badge>
      );
    }
    if (status === "shipped" || hasTracking) {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
          <Truck className="w-3 h-3 mr-1" /> Shipped
        </Badge>
      );
    }
    if (hasLabel) {
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 border">
          <Package className="w-3 h-3 mr-1" /> Label Ready
        </Badge>
      );
    }
    if (hasShipment) {
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 border">
          <Clock className="w-3 h-3 mr-1" /> Shipment Created
        </Badge>
      );
    }
    if (order.payment_status === "paid") {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
          <Package className="w-3 h-3 mr-1" /> Ready to Ship
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>
    );
  };

  const getNextAction = (order: ShippingOrder) => {
    const hasShipment = !!order.shipment?.external_shipment_id;
    const hasLabel = !!order.shipment?.label_url;

    if (!hasShipment && order.payment_status === "paid") {
      return "create";
    }
    if (hasShipment && !hasLabel) {
      return "buy_label";
    }
    if (hasLabel) {
      return "download";
    }
    return null;
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────

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
              Fulfill orders via Chit Chats — create shipments, buy labels, track packages
            </p>
          </div>
          <Button variant="outline" onClick={fetchOrders} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Unfulfilled", value: stats.total, color: "text-foreground" },
            { label: "Awaiting Shipment", value: stats.awaitingShipment, color: "text-amber-600" },
            { label: "Label Created", value: stats.labelCreated, color: "text-purple-600" },
            { label: "Shipped", value: stats.shipped, color: "text-blue-600" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, order ID, or tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing (Paid)</SelectItem>
                    <SelectItem value="label_created">Label Created</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
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
              Click &quot;Fulfill&quot; to create a Chit Chats shipment or buy a label
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                    <div className="w-20 h-6 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === filteredOrders.length &&
                            filteredOrders.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(filteredOrders.map((o) => o.id));
                            } else {
                              setSelectedOrders([]);
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
                      <TableHead>Tracking</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredOrders.map((order, index) => {
                        const nextAction = getNextAction(order);
                        return (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.04 }}
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
                                <p className="font-medium flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {order.full_name}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {order.email}
                                </p>
                                {order.phone && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {order.phone}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[180px]">
                                <p className="text-sm flex items-start gap-1">
                                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                  {order.address}
                                </p>
                                <p className="text-sm text-muted-foreground ml-4">
                                  {order.city}, {order.state} {order.postal_code}
                                </p>
                                <p className="text-sm text-muted-foreground ml-4">
                                  {order.country}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(order.total_amount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(order)}</TableCell>
                            <TableCell>
                              {order.shipment?.tracking_number ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-mono">
                                    {order.shipment.tracking_number}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      copyToClipboard(order.shipment!.tracking_number!)
                                    }
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : order.shipment?.external_shipment_id ? (
                                <span className="text-xs text-muted-foreground">
                                  Awaiting label
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {/* Download label */}
                                {order.shipment?.label_url && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() =>
                                      window.open(order.shipment!.label_url!, "_blank")
                                    }
                                  >
                                    <Download className="w-3 h-3" />
                                    Label
                                  </Button>
                                )}

                                {/* Primary action button */}
                                {nextAction === "create" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowFulfillment(true);
                                    }}
                                  >
                                    <Truck className="w-3 h-3 mr-1" />
                                    Fulfill
                                  </Button>
                                )}

                                {nextAction === "buy_label" && (
                                  <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    disabled={actionLoading === order.id}
                                    onClick={() => buyLabel(order.id)}
                                  >
                                    {actionLoading === order.id ? (
                                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                    ) : (
                                      <Package className="w-3 h-3 mr-1" />
                                    )}
                                    Buy Label
                                  </Button>
                                )}

                                {nextAction === "download" && (
                                  <Button size="sm" variant="outline" className="gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                    Done
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {loading ? "Loading orders..." : "No orders found"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Fulfill Dialog ─────────────────────────────────────────────── */}
        <Dialog open={showFulfillment} onOpenChange={setShowFulfillment}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Fulfill Order #{selectedOrder?.id}
              </DialogTitle>
              <DialogDescription>
                This will create a shipment in Chit Chats and generate a label.
                The customer will receive a tracking email after you buy the label.
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                {/* Order summary */}
                <Card>
                  <CardContent className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer</span>
                      <span className="font-medium">{selectedOrder.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ship to</span>
                      <span className="text-right">
                        {selectedOrder.address}
                        <br />
                        {selectedOrder.city}, {selectedOrder.state}{" "}
                        {selectedOrder.postal_code}
                        <br />
                        {selectedOrder.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items</span>
                      <span>{selectedOrder.items?.length ?? "—"} product(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">
                        {formatCurrency(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Current shipment state */}
                {selectedOrder.shipment?.external_shipment_id ? (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm">
                    <p className="font-medium text-yellow-800 mb-1">
                      Shipment already created in Chit Chats
                    </p>
                    <p className="text-yellow-700">
                      ID: {selectedOrder.shipment.external_shipment_id}
                    </p>
                    {selectedOrder.shipment.tracking_number && (
                      <p className="text-yellow-700">
                        Tracking: {selectedOrder.shipment.tracking_number}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm">
                    <p className="font-medium text-blue-800 mb-1">
                      Ready to create shipment
                    </p>
                    <p className="text-blue-700">
                      Chit Chats will assign a postage type based on the destination
                      ({selectedOrder.country}).
                    </p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setShowFulfillment(false)}>
                Cancel
              </Button>

              {/* Step 1: Create shipment */}
              {selectedOrder && !selectedOrder.shipment?.external_shipment_id && (
                <Button
                  onClick={() => selectedOrder && createShipment(selectedOrder.id)}
                  disabled={actionLoading === selectedOrder?.id}
                >
                  {actionLoading === selectedOrder?.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Shipment in Chit Chats
                    </>
                  )}
                </Button>
              )}

              {/* Step 2: Buy label */}
              {selectedOrder?.shipment?.external_shipment_id &&
                !selectedOrder.shipment?.label_url && (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => selectedOrder && buyLabel(selectedOrder.id)}
                    disabled={actionLoading === selectedOrder?.id}
                  >
                    {actionLoading === selectedOrder?.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Purchasing...
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        Buy Label &amp; Notify Customer
                      </>
                    )}
                  </Button>
                )}

              {/* Step 3: Download label */}
              {selectedOrder?.shipment?.label_url && (
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedOrder.shipment!.label_url!, "_blank")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Label
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
