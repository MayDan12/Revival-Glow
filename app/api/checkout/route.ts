import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    items,
    totalAmount,
  } = body;

  try {
    // ✅ Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    // ✅ Create a pending order in Supabase
    const { data: order } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: `${firstName} ${lastName}`,
          email,
          phone,
          address,
          city,
          state,
          zip_code: zipCode,
          total_amount: totalAmount,
          stripe_payment_intent: session.payment_intent,
        },
      ])
      .select()
      .single();

    // ✅ Add items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    await supabase.from("order_items").insert(orderItems);

    // ✅ Add a tracking record
    await supabase.from("order_tracking").insert([
      {
        order_id: order.id,
        tracking_number: Math.random().toString(36).substr(2, 9).toUpperCase(),
      },
    ]);

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    );
  }
}
