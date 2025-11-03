"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/orders/track?session_id=${sessionId}`);
        const data = await res.json();
        console.log("✅ Order data:", data);

        if (res.ok && data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("❌ Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-lg">
        Loading your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center mt-20">
        <p className="text-lg text-red-500">
          No order found. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-semibold text-center mb-2">
        Thank you for your purchase!
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Your order{" "}
        <span className="font-semibold text-gray-900">#{order.id}</span> has
        been successfully placed.
      </p>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">Order Details</h2>
        <div className="text-sm space-y-2 text-gray-700">
          <p>
            <strong>Total Amount:</strong> $
            {order.total_amount ? order.total_amount.toFixed(2) : "N/A"}
          </p>
          <p>
            <strong>Order Status:</strong> {order.order_status || "processing"}
          </p>
          <p>
            <strong>Tracking Number:</strong> {order.tracking?.tracking_number}
          </p>
          <p>
            <strong>Shipping Status:</strong> {order.tracking?.status}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.payment_status || "paid"}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Shipping Address:</strong> {order.address}, {order.city},{" "}
            {order.state}
          </p>
        </div>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-8 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
}
