import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const {
      items,
      userData,
      currencyCode,
      rate,
      totalAmount,
      total: legacyTotal,
    } = body;

    const requestedCurrency =
      typeof currencyCode === "string" ? currencyCode.toLowerCase() : "cad";
    const requestedRate =
      typeof rate === "number" && Number.isFinite(rate) ? rate : 1;
    const paymentCurrency =
      requestedCurrency === "cad" || requestedCurrency === "usd"
        ? requestedCurrency
        : "cad";
    const paymentRate =
      paymentCurrency === requestedCurrency ? requestedRate : 1;

    const normalizeZoneCode = (country: unknown): "CA" | "US" | "INTL" => {
      if (typeof country !== "string") return "CA";
      const value = country.trim().toLowerCase();
      if (value === "ca" || value === "canada" || value.includes("canada")) {
        return "CA";
      }
      if (
        value === "us" ||
        value === "usa" ||
        value === "united states" ||
        value.includes("united states")
      ) {
        return "US";
      }
      return "INTL";
    };

    const safeItems = Array.isArray(items) ? items : [];

    const missingWeightProductIds = Array.from(
      new Set(
        safeItems
          .filter(
            (item: any) =>
              !(
                typeof item?.weight === "number" && Number.isFinite(item.weight)
              ),
          )
          .map((item: any) => item?.id)
          .filter((id: any) => typeof id === "number" && Number.isFinite(id)),
      ),
    );

    const weightsById = new Map<number, number>();
    if (missingWeightProductIds.length > 0) {
      const { data: productsForWeight } = await supabase
        .from("products")
        .select("id, weight")
        .in("id", missingWeightProductIds);

      (productsForWeight || []).forEach((p: any) => {
        if (typeof p?.id === "number" && typeof p?.weight === "number") {
          weightsById.set(p.id, p.weight);
        }
      });
    }

    const totalWeightKg = safeItems.reduce((sum: number, item: any) => {
      const quantity =
        typeof item?.quantity === "number" && Number.isFinite(item.quantity)
          ? item.quantity
          : 1;
      const weight =
        typeof item?.weight === "number" && Number.isFinite(item.weight)
          ? item.weight
          : (weightsById.get(item?.id) ?? 0);
      return sum + weight * quantity;
    }, 0);

    const zoneCode = normalizeZoneCode(userData?.country);
    let baseShipping = 0;
    const { data: shippingRates, error: shippingRatesError } = await supabase
      .from("shipping_rates")
      .select("max_weight, price")
      .eq("zone_code", zoneCode)
      .order("max_weight", { ascending: true });

    if (shippingRatesError) {
      console.error("Shipping rates error:", shippingRatesError);
    } else if ((shippingRates || []).length > 0) {
      const parsedRates = (shippingRates || [])
        .map((r: any) => ({
          maxWeight:
            typeof r?.max_weight === "number"
              ? r.max_weight
              : Number.parseFloat(String(r?.max_weight)),
          price:
            typeof r?.price === "number"
              ? r.price
              : Number.parseFloat(String(r?.price)),
        }))
        .filter((r) => Number.isFinite(r.maxWeight) && Number.isFinite(r.price))
        .sort((a, b) => a.maxWeight - b.maxWeight);

      const matched =
        parsedRates.find((r) => totalWeightKg <= r.maxWeight) ||
        parsedRates[parsedRates.length - 1];
      baseShipping = matched?.price ?? 0;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    // Base amounts in CAD
    const baseSubtotal = safeItems.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const baseTax = baseSubtotal * 0.08;
    const baseTotal = baseSubtotal + baseTax + baseShipping;

    // Converted amounts for Stripe
    const convertedSubtotal = baseSubtotal * paymentRate;
    const convertedTax = baseTax * paymentRate;
    const convertedShipping = baseShipping * paymentRate;
    const expectedTotal = baseTotal * paymentRate;

    // Log for debugging
    console.log("Total verification:", {
      receivedTotal: totalAmount ?? legacyTotal,
      requestedCurrency,
      requestedRate,
      paymentCurrency,
      paymentRate,
      zoneCode,
      totalWeightKg,
      baseTotal,
      expectedTotal,
    });

    // Prepare line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: paymentCurrency,
          product_data: {
            name: "Order Subtotal",
          },
          unit_amount: Math.round(convertedSubtotal * 100), // Convert to cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: paymentCurrency,
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(convertedTax * 100), // Convert to cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: paymentCurrency,
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(convertedShipping * 100), // Convert to cents
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
          subtotal: Math.round(convertedSubtotal * 100), // ✅ Store in cents
          tax: Math.round(convertedTax * 100), // ✅ Store in cents
          shipping: Math.round(convertedShipping * 100), // ✅ Store in cents
          currency: paymentCurrency.toUpperCase(), // Store the currency code
          payment_status: "pending",
          stripe_session_id: session.id,
          order_status: "pending",
          items: safeItems,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save order to database" },
        { status: 500 },
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
    const orderItems = safeItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: Math.round(item.price * paymentRate * 100), // Store in cents in target currency
      subtotal: Math.round(item.price * item.quantity * paymentRate * 100), // Store in cents in target currency
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
      { status: 500 },
    );
  }
}
