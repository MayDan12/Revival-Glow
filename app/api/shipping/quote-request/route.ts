import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendQuoteRequestNotification } from "@/utils/emails/send";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { items, userData } = body;

    if (!userData?.email || !userData?.address || !userData?.country) {
      return NextResponse.json(
        { error: "Missing required contact or address information" },
        { status: 400 }
      );
    }

    const safeItems = Array.isArray(items) ? items : [];
    if (safeItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const baseSubtotal = safeItems.reduce((sum: number, item: any) => {
      return sum + (item.price ?? 0) * (item.quantity ?? 1);
    }, 0);

    const subtotalInCents = Math.round(baseSubtotal * 100);

    // Save quote request order to Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          email: userData.email,
          full_name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Customer",
          phone: userData.phone || "",
          address: userData.address || "",
          city: userData.city || "",
          state: userData.state || "",
          postal_code: userData.zipCode || "",
          country: userData.country || "Other",
          total_amount: subtotalInCents, // Total without shipping yet
          subtotal: subtotalInCents,
          tax: 0,
          shipping: 0,
          currency: "CAD",
          payment_status: "unpaid",
          order_status: "pending_quote",
          items: safeItems,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase quote insert error:", error);
      return NextResponse.json(
        { error: "Failed to save quote request to database" },
        { status: 500 }
      );
    }

    // Save order items
    const orderItems = safeItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: Math.round((item.price ?? 0) * 100),
      subtotal: Math.round((item.price ?? 0) * (item.quantity ?? 1) * 100),
    }));

    await supabase.from("order_items").insert(orderItems);

    const itemsSummary = safeItems
      .map((i: any) => `${i.quantity}x ${i.name}`)
      .join(", ");
    const fullAddress = `${userData.address}, ${userData.city}, ${userData.state} ${userData.zipCode}`;

    // 1. Send confirmation email to customer
    try {
      await sendQuoteRequestNotification(userData.email, {
        customerName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Valued Customer",
        customerEmail: userData.email,
        orderNumber: String(order.id),
        shippingAddress: fullAddress,
        country: userData.country,
        itemsSummary,
        isAdminNotification: false,
      });
    } catch (emailErr) {
      console.error("Failed to send customer quote notification email:", emailErr);
    }

    // 2. Send notification email to admin
    const adminEmail = process.env.RESEND_FROM || process.env.ADMIN_EMAIL || "info@revivalglow.com";
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      await sendQuoteRequestNotification(adminEmail, {
        customerName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Customer",
        customerEmail: userData.email,
        orderNumber: String(order.id),
        shippingAddress: fullAddress,
        country: userData.country,
        itemsSummary,
        isAdminNotification: true,
        adminDashboardUrl: `${baseUrl}/admin/orders`,
      });
    } catch (adminEmailErr) {
      console.error("Failed to send admin quote notification email:", adminEmailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Shipping quote request submitted successfully",
    });
  } catch (error: any) {
    console.error("❌ Quote Request Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
