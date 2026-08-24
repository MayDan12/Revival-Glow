import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendQuoteInvoice } from "@/utils/emails/send";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { orderId, shippingFee } = await req.json();

    if (!orderId || typeof shippingFee !== "number" || shippingFee < 0) {
      return NextResponse.json(
        { error: "orderId and a valid shippingFee are required" },
        { status: 400 }
      );
    }

    // 1. Fetch order from Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const shippingInCents = Math.round(shippingFee * 100);
    const subtotalInCents = order.subtotal || order.total_amount || 0;
    const grandTotalInCents = subtotalInCents + shippingInCents;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    // 2. Create a Stripe Checkout Session for the custom total
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: (order.currency || "CAD").toLowerCase(),
            product_data: {
              name: `Order #${order.id} Items Subtotal`,
            },
            unit_amount: subtotalInCents,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: (order.currency || "CAD").toLowerCase(),
            product_data: {
              name: "Custom International Shipping Fee",
            },
            unit_amount: shippingInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: order.email,
      metadata: {
        order_id: String(order.id),
        customer_name: order.full_name,
        shipping_address: `${order.address}, ${order.city}, ${order.state} ${order.postal_code}`,
      },
    });

    // 3. Update Order in Supabase with assigned shipping fee & total
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        shipping: shippingInCents,
        total_amount: grandTotalInCents,
        stripe_session_id: session.id,
        order_status: "quote_sent",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("❌ Failed to update order quote invoice:", updateError);
      return NextResponse.json(
        { error: "Failed to update order in database" },
        { status: 500 }
      );
    }

    // 4. Send invoice email to customer with Stripe checkout URL
    try {
      await sendQuoteInvoice(order.email, {
        customerName: order.full_name || "Valued Customer",
        orderNumber: String(order.id),
        subtotalAmount: `$${(subtotalInCents / 100).toFixed(2)} ${order.currency || "CAD"}`,
        shippingAmount: `$${shippingFee.toFixed(2)} ${order.currency || "CAD"}`,
        totalAmount: `$${(grandTotalInCents / 100).toFixed(2)} ${order.currency || "CAD"}`,
        paymentUrl: session.url!,
      });
    } catch (emailErr) {
      console.error("❌ Failed to send invoice email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Custom shipping invoice sent to customer successfully",
      paymentUrl: session.url,
    });
  } catch (error: any) {
    console.error("❌ Send Invoice Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
