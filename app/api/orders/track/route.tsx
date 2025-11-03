import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    // ✅ Fetch session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 404 });
    }

    // ✅ Get payment status
    const paymentStatus = session.payment_status;

    // ✅ Fetch the order from Supabase
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Error fetching order:", fetchError);
      return NextResponse.json(
        { error: "Error fetching order" },
        { status: 500 }
      );
    }

    if (!existingOrder) {
      return NextResponse.json({ error: "No order found" }, { status: 404 });
    }

    // ✅ Fetch tracking information from order_tracking table
    const { data: trackingData, error: trackingError } = await supabase
      .from("order_tracking")
      .select("tracking_number, status, updated_at")
      .eq("order_id", existingOrder.id)
      .maybeSingle();

    if (trackingError) {
      console.error("❌ Error fetching tracking info:", trackingError);
      // Don't fail the entire request if tracking fails
    }

    // ✅ Update payment and order status if paid
    if (paymentStatus === "paid") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", session.id);

      if (updateError) {
        console.error("❌ Error updating order:", updateError);
      }
    }

    return NextResponse.json({
      message: "Order retrieved successfully",
      payment_status: paymentStatus,
      order: {
        id: existingOrder.id,
        full_name: existingOrder.full_name,
        email: existingOrder.email,
        total_amount: existingOrder.total_amount,
        order_status:
          paymentStatus === "paid" ? "processing" : existingOrder.order_status,
        address: existingOrder.address,
        city: existingOrder.city,
        state: existingOrder.state,
        zip_code: existingOrder.zip_code, // Fixed: should be zip_code, not postal_code
        created_at: existingOrder.created_at,
        // Include tracking information
        tracking: trackingData,
      },
    });
  } catch (error: any) {
    console.error("❌ Error tracking order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
