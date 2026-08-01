/**
 * POST /api/webhooks/chitchats
 *
 * Receives status update webhooks from Chit Chats.
 * Validates the webhook secret, records a tracking event,
 * and auto-updates order/shipment status.
 *
 * To enable webhooks, go to Chit Chats Settings > Developer > Webhooks
 * and point it to: https://yourdomain.com/api/webhooks/chitchats
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // ── 1. Validate webhook secret ───────────────────────────────────────
    const webhookSecret = process.env.CHITCHATS_WEBHOOK_SECRET;
    if (webhookSecret) {
      const receivedSecret = req.headers.get("x-chitchats-secret") ??
        req.headers.get("x-webhook-secret");

      if (receivedSecret !== webhookSecret) {
        console.warn("Chit Chats webhook: invalid secret");
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    const supabase = await createClient();

    // ── 2. Extract shipment data from payload ────────────────────────────
    //    Chit Chats webhook payload structure (approximate — confirm with your account):
    //    { event: "shipment.status_changed", shipment: { id, status, tracking_number, ... } }
    const eventType = payload.event ?? payload.type ?? "";
    const chitchatsShipment = payload.shipment ?? payload.data?.shipment ?? payload;

    const externalShipmentId = chitchatsShipment?.id;
    const newStatus = chitchatsShipment?.status;
    const trackingNumber = chitchatsShipment?.tracking_number;

    if (!externalShipmentId) {
      console.warn("Chit Chats webhook: missing shipment id");
      return NextResponse.json({ received: true });
    }

    // ── 3. Find our shipment record ──────────────────────────────────────
    const { data: shipment } = await supabase
      .from("shipments")
      .select("id, order_id, status")
      .eq("external_shipment_id", externalShipmentId)
      .maybeSingle();

    if (!shipment) {
      // Not our shipment or created outside this app — ignore
      console.warn("Chit Chats webhook: no matching shipment for", externalShipmentId);
      return NextResponse.json({ received: true });
    }

    // ── 4. Record the tracking event ─────────────────────────────────────
    await supabase.from("shipment_events").insert({
      shipment_id: shipment.id,
      status: newStatus ?? eventType,
      description: chitchatsShipment?.tracking_message ?? chitchatsShipment?.description ?? eventType,
      location: chitchatsShipment?.location ?? null,
      event_time: chitchatsShipment?.event_time ?? new Date().toISOString(),
      raw_payload: payload,
    });

    // ── 5. Update shipment status ────────────────────────────────────────
    if (newStatus && newStatus !== shipment.status) {
      await supabase
        .from("shipments")
        .update({
          status: newStatus,
          tracking_number: trackingNumber ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", shipment.id);
    }

    // ── 6. Map Chit Chats status to order status ─────────────────────────
    const orderStatusMap: Record<string, string> = {
      ready: "label_created",
      in_transit: "shipped",
      out_for_delivery: "shipped",
      delivered: "delivered",
      exception: "shipping_failed",
      returned: "cancelled",
    };

    const mappedOrderStatus = orderStatusMap[newStatus ?? ""];
    if (mappedOrderStatus && shipment.order_id) {
      await supabase
        .from("orders")
        .update({ order_status: mappedOrderStatus })
        .eq("id", shipment.order_id);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Chit Chats webhook error:", error);
    // Always return 200 to Chit Chats so it doesn't retry
    return NextResponse.json({ received: true, error: error.message });
  }
}
