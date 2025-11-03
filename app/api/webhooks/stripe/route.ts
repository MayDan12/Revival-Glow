import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  try {
    // ✅ Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // ✅ Handle successful payment event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const supabase = await createClient();

      const metadata = session.metadata || {};

      // ✅ Save the order details into Supabase
      const { error } = await supabase.from("orders").insert([
        {
          email: metadata.email,
          full_name: metadata.full_name,
          phone: metadata.phone,
          address: metadata.address,
          city: metadata.city,
          state: metadata.state,
          postal_code: metadata.postal_code,
          country: metadata.country,
          total_amount: session.amount_total
            ? session.amount_total / 100
            : null,
          payment_status: session.payment_status,
          payment_intent: session.payment_intent,
          stripe_session_id: session.id,
          order_status: "processing",
        },
      ]);

      if (error) {
        console.error("❌ Error saving order:", error.message);
      } else {
        console.log("✅ Order saved for:", metadata.email);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("⚠️ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
