// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { CheckCircle } from "lucide-react";

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_id");
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       if (!sessionId) return;

//       try {
//         const res = await fetch(`/api/orders/track?session_id=${sessionId}`);
//         const data = await res.json();
//         console.log("✅ Order data:", data);

//         if (res.ok && data.order) {
//           setOrder(data.order);
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch order:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [sessionId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center mt-20 text-lg">
//         Loading your order...
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="flex flex-col items-center mt-20">
//         <p className="text-lg text-red-500">
//           No order found. Please contact support.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center py-20 px-6">
//       <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
//       <h1 className="text-2xl font-semibold text-center mb-2">
//         Thank you for your purchase!
//       </h1>
//       <p className="text-gray-600 text-center mb-6">
//         Your order{" "}
//         <span className="font-semibold text-gray-900">#{order.id}</span> has
//         been successfully placed.
//       </p>

//       <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
//         <h2 className="text-lg font-semibold mb-3">Order Details</h2>
//         <div className="text-sm space-y-2 text-gray-700">
//           <p>
//             <strong>Total Amount:</strong> $
//             {order.total_amount ? order.total_amount.toFixed(2) : "N/A"}
//           </p>
//           <p>
//             <strong>Order Status:</strong> {order.order_status || "processing"}
//           </p>
//           <p>
//             <strong>Tracking Number:</strong> {order.tracking?.tracking_number}
//           </p>
//           <p>
//             <strong>Shipping Status:</strong> {order.tracking?.status}
//           </p>
//           <p>
//             <strong>Payment Status:</strong> {order.payment_status || "paid"}
//           </p>
//           <p>
//             <strong>Email:</strong> {order.email}
//           </p>
//           <p>
//             <strong>Shipping Address:</strong> {order.address}, {order.city},{" "}
//             {order.state}
//           </p>
//         </div>
//       </div>

//       <button
//         onClick={() => (window.location.href = "/")}
//         className="mt-8 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
//       >
//         Continue Shopping
//       </button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  Home,
  Copy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/currency";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/orders/track?session_id=${sessionId}`);
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
  }, [sessionId]);

  const copyOrderNumber = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your order...</p>
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
            We couldn't locate your order. Please contact support for
            assistance.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-950 rounded-full mb-6 mx-auto">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Thank you for your order!
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Your purchase has been confirmed and is being prepared for shipment
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-8 border-b border-border gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Order Number
              </p>
              <p className="text-2xl font-bold text-foreground">{order.id}</p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition text-sm font-medium"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Order Total
              </p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(order.total_amount)}
                {/* {order.total_amount ? order.total_amount.toFixed(2) : "0.00"} */}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Payment Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-lg font-semibold text-foreground capitalize">
                  {order.payment_status || "Completed"}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Order Status
              </p>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                {order.order_status || "Processing"}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Email
              </p>
              <p className="text-lg text-foreground">{order.email}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Shipping Address
            </p>
            <p className="text-foreground leading-relaxed">
              {order.address}
              <br />
              {order.city}, {order.state}
            </p>
            {order.tracking?.tracking_number && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Tracking Number
                </p>
                <code className="block bg-muted p-2 rounded text-sm font-mono text-foreground break-all">
                  {order.tracking.tracking_number}
                </code>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Order Timeline
          </h2>
          <div className="space-y-4">
            {[
              { icon: Package, label: "Order Confirmed", status: "complete" },
              {
                icon: Package,
                label: "Processing",
                status:
                  order.order_status === "shipped" ? "complete" : "current",
              },
              {
                icon: Truck,
                label: "Shipped",
                status:
                  order.order_status === "shipped" ? "complete" : "pending",
              },
              { icon: Home, label: "Delivered", status: "pending" },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === "complete"
                          ? "bg-green-500 text-white"
                          : step.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {idx < 3 && (
                      <div className="w-0.5 h-8 bg-border my-1"></div>
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p
                      className={`font-medium ${
                        step.status === "pending"
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/track/${order.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
          >
            Track Order
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
