// app/tracking/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Copy,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

// Types
interface TrackingOrder {
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
  tracking_number?: string;
  carrier?: string;
  shipping_method?: string;
  estimated_delivery?: string;
  items: any[];
  created_at: string;
  updated_at?: string;
}

interface TrackingEvent {
  id: number;
  order_id: number;
  status: string;
  description: string;
  location?: string;
  created_at: string;
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const trackOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!orderId.trim() || !email.trim()) {
      toast.error("Please enter both order ID and email");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", parseInt(orderId))
        .eq("email", email.toLowerCase())
        .single();

      if (orderError) {
        if (orderError.code === "PGRST116") {
          toast.error("Order not found. Please check your order ID and email.");
        } else {
          throw orderError;
        }
        return;
      }

      if (!orderData) {
        toast.error("Order not found. Please check your order ID and email.");
        return;
      }

      setOrder(orderData);

      // Fetch tracking events
      const { data: eventsData, error: eventsError } = await supabase
        .from("order_tracking_events")
        .select("*")
        .eq("order_id", parseInt(orderId))
        .order("created_at", { ascending: true });

      if (eventsError) throw eventsError;

      // If no tracking events exist, create initial ones based on order status
      if (!eventsData || eventsData.length === 0) {
        await createInitialTrackingEvents(orderData);
        const { data: newEvents } = await supabase
          .from("order_tracking_events")
          .select("*")
          .eq("order_id", parseInt(orderId))
          .order("created_at", { ascending: true });

        setTrackingEvents(newEvents || []);
      } else {
        setTrackingEvents(eventsData);
      }

      toast.success("Order found!");
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createInitialTrackingEvents = async (order: TrackingOrder) => {
    const events = [
      {
        order_id: order.id,
        status: "order_placed",
        description: "Order confirmed and payment received",
        location: "Online Store",
        created_at: order.created_at,
      },
    ];

    if (
      order.order_status === "processing" ||
      order.order_status === "shipped" ||
      order.order_status === "delivered"
    ) {
      events.push({
        order_id: order.id,
        status: "processing",
        description: "Order is being processed and prepared for shipment",
        location: "Warehouse",
        created_at: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(), // 2 days ago
      });
    }

    if (
      order.order_status === "shipped" ||
      order.order_status === "delivered"
    ) {
      events.push({
        order_id: order.id,
        status: "shipped",
        description: `Order has been shipped via ${order.carrier}`,
        location: "Shipping Facility",
        created_at: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 day ago
      });
    }

    if (order.order_status === "delivered") {
      events.push({
        order_id: order.id,
        status: "delivered",
        description: "Order has been delivered",
        location: order.city + ", " + order.state,
        created_at: new Date().toISOString(),
      });
    }

    await supabase.from("order_tracking_events").insert(events);
  };

  const copyTrackingNumber = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number);
      toast.success("Tracking number copied to clipboard!");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing":
        return <Package className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "shipped":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "processing":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "pending":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCarrierTrackingUrl = (carrier: string, trackingNumber: string) => {
    const carriers: { [key: string]: string } = {
      USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      FedEx: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    };

    return (
      carriers[carrier] ||
      `https://www.google.com/search?q=${carrier}+tracking+${trackingNumber}`
    );
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your order ID and email address to check the status of your
            shipment
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <form onSubmit={trackOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="orderId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Order ID
                    </label>
                    <Input
                      id="orderId"
                      type="text"
                      placeholder="e.g., 12345"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tracking Order...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Tracking Results */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{order.id}</span>
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{order.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{order.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{order.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Shipping Address</p>
                          <p>{order.address}</p>
                          <p>
                            {order.city}, {order.state} {order.postal_code}
                          </p>
                          <p>{order.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <p className="font-medium">Order Total</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(order.total_amount)}
                        </p>
                      </div>
                      {order.tracking_number && (
                        <div className="text-sm">
                          <p className="font-medium">Tracking Number</p>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {order.tracking_number}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyTrackingNumber}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {order.carrier && (
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={getCarrierTrackingUrl(
                                    order.carrier,
                                    order.tracking_number
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Progress</CardTitle>
                  <CardDescription>
                    Follow your order through the fulfillment process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === trackingEvents.length - 1
                                ? "bg-green-500 ring-4 ring-green-200"
                                : "bg-blue-500"
                            }`}
                          />
                          {index < trackingEvents.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 mt-1" />
                          )}
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {event.status.replace("_", " ")}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {formatDate(event.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">
                            {event.description}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-500">
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-600">
                              Variant: {item.variant}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Delivery */}
              {order.estimated_delivery && (
                <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          Estimated Delivery
                        </h3>
                        <p className="text-blue-100">
                          {formatDate(order.estimated_delivery)}
                        </p>
                      </div>
                      <Truck className="w-12 h-12 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* No Results State */}
          {searched && !order && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Order Not Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find an order matching your search. Please check
                your order ID and email address, and try again.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Can't find your order or having issues with tracking?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <a href="mailto:support@revivalglow.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/contact">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
