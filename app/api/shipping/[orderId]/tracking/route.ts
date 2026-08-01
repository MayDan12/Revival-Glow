/**
 * GET /api/shipping/[orderId]/tracking
 *
 * Returns shipment details and tracking events for an order.
 * Used by the customer tracking page and admin dashboard.
 *
 * Does NOT require admin auth — order lookup is by orderId + optionally
 * verified against customer email (passed as query param for customer-facing use).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getChitChatsShipment } from "@/lib/chitchats";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    const { searchParams } = req.nextUrl;
    const emailVerification = searchParams.get("email");

    const supabase = await createClient();

    // ── 1. Load order ────────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, email, full_name, customer_name, order_status, payment_status, city, country, created_at")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── 2. Optional: verify email for customer-facing requests ───────────
    if (emailVerification) {
      if (order.email?.toLowerCase() !== emailVerification.toLowerCase()) {
        return NextResponse.json(
          { error: "Order not found or email does not match" },
          { status: 404 },
        );
      }
    }

    // ── 3. Load shipment from Supabase ───────────────────────────────────
    const { data: shipment } = await supabase
      .from("shipments")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    // ── 4. Load tracking events ──────────────────────────────────────────
    const { data: events } = await supabase
      .from("shipment_events")
      .select("*")
      .eq("shipment_id", shipment?.id ?? "00000000-0000-0000-0000-000000000000")
      .order("event_time", { ascending: false });

    // ── 5. Optionally refresh from Chit Chats ────────────────────────────
    //    Refresh if the shipment exists but doesn't show as delivered yet
    let liveShipment = null;
    if (
      shipment?.external_shipment_id &&
      shipment.status !== "delivered" &&
      process.env.CHITCHATS_API_TOKEN
    ) {
      try {
        liveShipment = await getChitChatsShipment(shipment.external_shipment_id);

        // Sync status back to DB if it changed
        if (liveShipment.status && liveShipment.status !== shipment.status) {
          await supabase
            .from("shipments")
            .update({
              status: liveShipment.status,
              tracking_number: liveShipment.tracking_number ?? shipment.tracking_number,
              label_url: liveShipment.label_url ?? shipment.label_url,
              updated_at: new Date().toISOString(),
            })
            .eq("id", shipment.id);
        }
      } catch (err) {
        // Non-fatal — we still return DB data
        console.error("Live Chit Chats refresh failed:", err);
      }
    }

    const effectiveShipment = liveShipment
      ? { ...shipment, status: liveShipment.status, tracking_number: liveShipment.tracking_number ?? shipment?.tracking_number }
      : shipment;

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.order_status,
        customerName: order.full_name ?? order.customer_name,
        city: order.city,
        country: order.country,
        createdAt: order.created_at,
      },
      shipment: effectiveShipment ?? null,
      events: events ?? [],
    });
  } catch (error: any) {
    console.error("tracking route error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
