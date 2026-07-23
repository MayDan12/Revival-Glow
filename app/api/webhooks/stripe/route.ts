import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { sendOrderConfirmation } from "@/utils/emails/send";

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

      if (metadata.order_id) {
        // ✅ Update the existing pending order instead of creating a duplicate
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "processing",
          })
          .eq("id", metadata.order_id);

        if (error) {
          console.error("❌ Error updating order:", error.message);
        } else {
          console.log("✅ Order updated for:", session.customer_email || metadata.email);

          // ✅ Send order confirmation email
          const customerEmail = session.customer_details?.email || session.customer_email;
          if (customerEmail) {
            try {
              await sendOrderConfirmation(customerEmail, {
                customerName: metadata.customer_name || "Valued Customer",
                orderNumber: metadata.order_id,
                orderTotal: session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "Paid",
              });
              console.log("📧 Order confirmation email sent to:", customerEmail);
            } catch (emailErr) {
              console.error("❌ Failed to send order confirmation email:", emailErr);
            }
          }
        }
      } else {
        console.error("❌ Missing order_id in session metadata");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("⚠️ Webhook Error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

