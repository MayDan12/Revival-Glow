/**
 * POST /api/shipping/buy-label
 *
 * Admin-triggered. Buys postage on an existing Chit Chats shipment,
 * stores the label URL + tracking number, and sends the customer a
 * shipping notification email.
 *
 * Body: { orderId: number }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  assertChitChatsConfig,
  buyChitChatsLabel,
  getChitChatsShipment,
} from "@/lib/chitchats";
import { sendShippingNotification } from "@/utils/emails/send";

export async function POST(req: NextRequest) {
  try {
    assertChitChatsConfig();

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // ── 1. Load the shipment record ──────────────────────────────────────
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: "No shipment found for this order. Create a shipment first." },
        { status: 404 },
      );
    }

    if (!shipment.external_shipment_id) {
      return NextResponse.json(
        { error: "Shipment has no external ID — cannot buy label." },
        { status: 422 },
      );
    }

    // ── 2. Load order for customer details ───────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("email, full_name, customer_name")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── 3. If label already exists, return it without re-purchasing ──────
    if (shipment.label_url && shipment.tracking_number) {
      return NextResponse.json({
        message: "Label already purchased",
        labelUrl: shipment.label_url,
        trackingNumber: shipment.tracking_number,
        shipment,
      });
    }

    // ── 4. Fetch the latest state from Chit Chats ────────────────────────
    //    (the shipment may already have a label if postage was purchased at creation)
    let result = await getChitChatsShipment(shipment.external_shipment_id);

    let labelUrl = result.label_url as string | null;
    let trackingNumber = result.tracking_number as string | null;

    // ── 5. Buy postage if not already purchased ──────────────────────────
    if (!labelUrl || !trackingNumber) {
      const buyResult = await buyChitChatsLabel(
        shipment.external_shipment_id,
        shipment.service_name ?? "chit_chats_canada_tracked",
      );
      labelUrl = buyResult.labelUrl;
      trackingNumber = buyResult.trackingNumber;
    }

    // ── 6. Update shipments table ────────────────────────────────────────
    const { data: updatedShipment, error: updateError } = await supabase
      .from("shipments")
      .update({
        label_url: labelUrl,
        tracking_number: trackingNumber,
        status: "label_purchased",
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipment.id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update shipment:", updateError);
    }

    // ── 7. Update order status ───────────────────────────────────────────
    await supabase
      .from("orders")
      .update({
        order_status: "label_created",
        tracking_number: trackingNumber,
      })
      .eq("id", orderId);

    // ── 8. Send shipping notification email ──────────────────────────────
    const customerEmail = order.email;
    const customerName = order.full_name ?? order.customer_name ?? "Valued Customer";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://revivalglowcare.com";
    const trackingUrl = `${baseUrl}/track?order=${orderId}`;

    if (customerEmail) {
      try {
        await sendShippingNotification(customerEmail, {
          customerName,
          orderNumber: String(orderId),
          trackingNumber: trackingNumber ?? undefined,
          trackingUrl,
        });
      } catch (emailErr) {
        // Non-fatal — log but don't fail the request
        console.error("Failed to send shipping notification email:", emailErr);
      }
    }

    return NextResponse.json({
      labelUrl,
      trackingNumber,
      shipment: updatedShipment ?? shipment,
    });
  } catch (error: any) {
    console.error("buy-label error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
