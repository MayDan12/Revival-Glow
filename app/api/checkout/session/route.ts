// import { createClient } from "@/utils/supabase/server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: NextRequest) {
//   const supabase = await createClient();

//   try {
//     const { items, userData, total } = await req.json();

//     const baseUrl =
//       process.env.NEXT_PUBLIC_BASE_URL ||
//       `${req.nextUrl.protocol}//${req.nextUrl.host}`;

//     const calculatedTotal = items.reduce((sum: number, item: any) => {
//       return sum + item.price * item.quantity;
//     }, 0);

//     const calculatedTax = calculatedTotal * 0.08;
//     const calculatedShipping = 10.0;
//     const expectedTotal = calculatedTotal + calculatedTax + calculatedShipping;

//     // Log for debugging
//     console.log("Total verification:", {
//       receivedTotal: total,
//       calculatedTotal,
//       calculatedTax,
//       calculatedShipping,
//       expectedTotal,
//     });

//     // Prepare line items for Stripe
//     const line_items = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Order Subtotal",
//           },
//           unit_amount: Math.round(calculatedTotal * 100),
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Tax",
//           },
//           unit_amount: Math.round(calculatedTax * 100),
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Shipping",
//           },
//           unit_amount: Math.round(calculatedShipping * 100),
//         },
//         quantity: 1,
//       },
//     ];

//     // Create a Stripe Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${baseUrl}/cart`,
//       customer_email: userData.email,
//       metadata: {
//         customer_name: `${userData.firstName} ${userData.lastName}`,
//         customer_phone: userData.phone,
//         shipping_address: `${userData.address}, ${userData.city}, ${userData.state} ${userData.zipCode}`,
//       },
//     });

//     // Calculate total amount for database (convert back to dollars for storage)
//     const totalAmount = expectedTotal / 100;

//     // Save order to Supabase before redirect
//     const { data: order, error } = await supabase
//       .from("orders")
//       .insert([
//         {
//           email: userData.email,
//           full_name: `${userData.firstName} ${userData.lastName}`,
//           phone: userData.phone,
//           address: userData.address,
//           city: userData.city,
//           state: userData.state,
//           postal_code: userData.zipCode,
//           country: userData.country,
//           total_amount: totalAmount,
//           subtotal: expectedTotal,
//           tax: calculatedTax,
//           shipping: calculatedShipping,
//           payment_status: "pending",
//           stripe_session_id: session.id,
//           order_status: "pending",
//           items: items, // Store the items as JSON
//           created_at: new Date().toISOString(),
//         },
//       ])
//       .select()
//       .single();

//     if (error) {
//       console.error("❌ Supabase insert error:", error);
//       return NextResponse.json(
//         { error: "Failed to save order to database" },
//         { status: 500 }
//       );
//     }

//     // Update session metadata with order ID
//     await stripe.checkout.sessions.update(session.id, {
//       metadata: {
//         ...session.metadata,
//         order_id: order.id,
//       },
//     });

//     const orderItems = items.map((item: any) => ({
//       order_id: order.id,
//       product_id: item.id,
//       product_name: item.name,
//       quantity: item.quantity,
//       price: item.price,
//       subtotal: item.price * item.quantity,
//     }));

//     const { error: itemsError } = await supabase
//       .from("order_items")
//       .insert(orderItems);

//     if (itemsError) {
//       console.error("Order items error:", itemsError);
//       // Don't fail the entire request if items fail, but log it
//     }

//     // ✅ Add a tracking record (optional)
//     await supabase.from("order_tracking").insert([
//       {
//         order_id: order.id,
//         tracking_number: Math.random().toString(36).substr(2, 9).toUpperCase(),
//         status: "pending",
//       },
//     ]);

//     return NextResponse.json({ id: session.id, url: session.url });
//   } catch (error: any) {
//     console.error("❌ Stripe Checkout Error:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { items, userData, total } = await req.json();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const calculatedTotal = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const calculatedTax = calculatedTotal * 0.08;
    const calculatedShipping = 10.0;
    const expectedTotal = calculatedTotal + calculatedTax + calculatedShipping;

    // Log for debugging
    console.log("Total verification:", {
      receivedTotal: total,
      calculatedTotal,
      calculatedTax,
      calculatedShipping,
      expectedTotal,
    });

    // Prepare line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Order Subtotal",
          },
          unit_amount: Math.round(calculatedTotal * 100), // Convert to cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(calculatedTax * 100), // Convert to cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(calculatedShipping * 100), // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: userData.email,
      metadata: {
        customer_name: `${userData.firstName} ${userData.lastName}`,
        customer_phone: userData.phone,
        shipping_address: `${userData.address}, ${userData.city}, ${userData.state} ${userData.zipCode}`,
      },
    });

    // ✅ FIXED: Store amounts in cents (consistent with Stripe) OR dollars (consistent with your frontend)
    // Option 1: Store in cents (recommended for consistency)
    const totalAmountInCents = Math.round(expectedTotal * 100);

    // Option 2: Store in dollars (if you prefer)
    // const totalAmountInDollars = expectedTotal;

    // Save order to Supabase before redirect
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          email: userData.email,
          full_name: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          postal_code: userData.zipCode,
          country: userData.country,
          total_amount: totalAmountInCents, // ✅ Now storing in cents
          subtotal: Math.round(calculatedTotal * 100), // ✅ Store in cents
          tax: Math.round(calculatedTax * 100), // ✅ Store in cents
          shipping: Math.round(calculatedShipping * 100), // ✅ Store in cents
          payment_status: "pending",
          stripe_session_id: session.id,
          order_status: "pending",
          items: items,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save order to database" },
        { status: 500 }
      );
    }

    // Update session metadata with order ID
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        order_id: order.id,
      },
    });

    // Store order items (also in cents for consistency)
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: Math.round(item.price * 100), // ✅ Store in cents
      subtotal: Math.round(item.price * item.quantity * 100), // ✅ Store in cents
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Don't fail the entire request if items fail, but log it
    }

    // Add a tracking record
    await supabase.from("order_tracking").insert([
      {
        order_id: order.id,
        tracking_number: Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: "pending",
      },
    ]);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
