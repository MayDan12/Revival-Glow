/**
 * POST /api/shipping/create-shipment
 *
 * Admin-triggered. Creates a shipment in Chit Chats for a paid order
 * and saves the result to the `shipments` table.
 *
 * Body: { orderId: number }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  assertChitChatsConfig,
  createChitChatsShipment,
  resolvePostageType,
  getCountryCode,
} from "@/lib/chitchats";
import { getZoneCode, type ZoneCode } from "@/lib/countries";

export async function POST(req: NextRequest) {
  try {
    assertChitChatsConfig();

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // ── 1. Fetch the order ───────────────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      console.error("❌ Order fetch error in create-shipment:", orderError);
      return NextResponse.json(
        { error: orderError?.message || `Order #${orderId} not found` },
        { status: 404 }
      );
    }

    if (order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Cannot ship an unpaid order" },
        { status: 422 },
      );
    }

    // ── 2. Check for duplicate shipment ──────────────────────────────────
    const { data: existingShipment } = await supabase
      .from("shipments")
      .select("id, external_shipment_id, status")
      .eq("order_id", orderId)
      .maybeSingle();

    if (existingShipment?.external_shipment_id) {
      return NextResponse.json(
        {
          error: "Shipment already created for this order",
          shipment: existingShipment,
        },
        { status: 409 },
      );
    }

    // ── 3. Calculate total weight ────────────────────────────────────────
    let items = order.items ?? order.order_items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      const { data: dbOrderItems } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (dbOrderItems && dbOrderItems.length > 0) {
        items = dbOrderItems;
      }
    }

    const totalWeightGrams = (Array.isArray(items) ? items : []).reduce(
      (sum: number, item: any) => {
        const weightKg =
          typeof item?.weight === "number" && Number.isFinite(item.weight)
            ? item.weight
            : 0;
        return sum + weightKg * 1000 * (item.quantity ?? 1);
      },
      0
    );

    // Fallback: minimum 100g if items have no weight data
    const weightGrams = Math.max(Math.round(totalWeightGrams), 100);

    // ── 4. Resolve zone and postage type ─────────────────────────────────
    const country = (order.country ?? "Canada") as string;
    const zoneCode: ZoneCode = getZoneCode(country);
    const countryCode = getCountryCode(country);
    const postageType = resolvePostageType(zoneCode, weightGrams);

    // ── 5. Create shipment in Chit Chats ─────────────────────────────────
    const shipmentPayload = {
      name: order.full_name ?? order.customer_name ?? "Customer",
      address1: order.address ?? "",
      city: order.city ?? "",
      provinceCode: order.state ?? "",
      postalCode: order.postal_code ?? order.zip_code ?? "",
      countryCode,
      description: "Skincare products",
      // Declared value in CAD (order total / 100 since stored in cents)
      value: Math.round((order.total_amount ?? 0) / 100),
      weightGrams,
      postageType,
      reference: String(orderId),
    };

    const chitchatsShipment = await createChitChatsShipment(shipmentPayload);

    // ── 6. Save to shipments table ───────────────────────────────────────
    const shipmentRecord = {
      order_id: orderId,
      provider: "chitchats",
      external_shipment_id: chitchatsShipment.id,
      tracking_number: chitchatsShipment.tracking_number ?? null,
      label_url: chitchatsShipment.label_url ?? null,
      service_name: postageType,
      shipping_cost: chitchatsShipment.postage_rate ?? null,
      status: chitchatsShipment.status ?? "pending",
      raw_response: chitchatsShipment,
    };

    const { data: savedShipment, error: saveError } = await supabase
      .from("shipments")
      .upsert(existingShipment?.id
        ? { id: existingShipment.id, ...shipmentRecord }
        : shipmentRecord,
      )
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save shipment:", saveError);
      return NextResponse.json(
        { error: "Shipment created in Chit Chats but failed to save to database" },
        { status: 500 },
      );
    }

    // ── 7. Update order status ───────────────────────────────────────────
    await supabase
      .from("orders")
      .update({ order_status: "label_created" })
      .eq("id", orderId);

    return NextResponse.json({ shipment: savedShipment }, { status: 201 });
  } catch (error: any) {
    console.error("create-shipment error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
