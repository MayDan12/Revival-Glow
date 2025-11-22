"use client";

import { useEffect, useState, use } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function TrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedInfo, setExpandedInfo] = useState<string | null>("shipping");
  const param = use(params);
  const { orderId } = param;
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/track?session_id=${orderId}`);
        const data = await res.json();

        if (res.ok && data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tracking details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4 text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Order Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find tracking information for this order.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300";
    }
  };

  const isDelivered = order.tracking?.status?.toLowerCase() === "delivered";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition mb-8 font-medium"
        >
          ← Back to Home
        </Link>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Order ID
              </p>
              <p className="text-2xl font-bold text-foreground">{order.id}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.tracking?.status
              )}`}
            >
              {order.tracking?.status || "Processing"}
            </div>
          </div>

          <div className="mb-8 pb-8 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              {[
                { label: "Order Placed", done: true },
                {
                  label: "Processing",
                  done: order.order_status !== "processing",
                },
                {
                  label: "Shipped",
                  done: order.tracking?.status === "shipped" || isDelivered,
                },
                { label: "Delivered", done: isDelivered },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors mb-2 ${
                      step.done
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground border-2 border-border"
                    }`}
                  >
                    {step.done ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                  </div>
                  <p
                    className={`text-xs text-center ${
                      step.done
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {idx < 3 && (
                    <div
                      className={`absolute w-1/4 h-1 mt-5 ${
                        step.done ? "bg-green-500" : "bg-border"
                      }`}
                      style={{
                        left: `calc(${(idx + 1) * 25}% + 20px)`,
                        marginTop: "20px",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Estimated Delivery
                </p>
                <p className="text-foreground font-semibold">
                  {isDelivered ? "Delivered" : "Dec 15 - Dec 18, 2024"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Carrier
                </p>
                <p className="text-foreground font-semibold">FedEx Ground</p>
              </div>
            </div>
          </div>

          {order.tracking?.tracking_number && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Tracking Number
              </p>
              <code className="text-foreground font-mono text-lg">
                {order.tracking.tracking_number}
              </code>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {[
            {
              id: "shipping",
              title: "Shipping Address",
              icon: MapPin,
              content: (
                <div className="text-foreground">
                  <p className="font-semibold mb-1">{order.email}</p>
                  <p>{order.address}</p>
                  <p>
                    {order.city}, {order.state}
                  </p>
                </div>
              ),
            },
            {
              id: "contact",
              title: "Contact Information",
              icon: Phone,
              content: (
                <div className="space-y-2 text-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    {order.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We'll send shipping updates to this email
                  </p>
                </div>
              ),
            },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedInfo(
                      expandedInfo === section.id ? null : section.id
                    )
                  }
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-muted transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedInfo === section.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedInfo === section.id && (
                  <div className="px-4 sm:px-6 py-4 border-t border-border bg-muted/30">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions about your order, our customer support
            team is here to help.
          </p>
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
