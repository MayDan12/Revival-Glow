/**
 * Chit Chats API Service
 *
 * All Chit Chats communication is server-side only.
 * Never import this in client components.
 *
 * API base: https://chitchats.com/api/v1/clients/{CLIENT_ID}/
 * Docs:     https://chitchats.com/docs/api/v1
 */

import { resolveCountry, getZoneCode, type ZoneCode } from "@/lib/countries";

const BASE_URL = process.env.CHITCHATS_BASE_URL || "https://chitchats.com/api/v1";
const CLIENT_ID = process.env.CHITCHATS_CLIENT_ID!;
const API_TOKEN = process.env.CHITCHATS_API_TOKEN!;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type { ZoneCode };

export interface CreateShipmentPayload {
  /** Recipient full name */
  name: string;
  /** Street address line 1 */
  address1: string;
  /** Street address line 2 (optional) */
  address2?: string;
  /** City */
  city: string;
  /**
   * Province/state code (e.g. "BC", "ON", "CA", "NY")
   * Required for Canada and US shipments
   */
  provinceCode?: string;
  /** Postal / ZIP code */
  postalCode: string;
  /**
   * ISO 3166-1 alpha-2 country code.
   * Canada = "CA", United States = "US"
   */
  countryCode: string;
  /** Short description of the package contents */
  description: string;
  /** Declared value of the package (CAD) */
  value: number;
  /** Total weight in grams */
  weightGrams: number;
  /** Chit Chats postage type — derived from zone */
  postageType: string;
  /** Ship date, defaults to "today" */
  shipDate?: string;
  /** Internal reference (your order ID) */
  reference?: string;
}

export interface ChitChatsShipment {
  id: string;
  status: string;
  tracking_number: string | null;
  label_url: string | null;
  postage_type: string;
  postage_rate: number | null;
  estimated_delivery_date: string | null;
  created_at: string;
  updated_at: string;
  /** Full raw response stored for debugging */
  [key: string]: unknown;
}

export interface BuyLabelResult {
  trackingNumber: string;
  labelUrl: string;
  shipmentId: string;
  carrier: string;
  postageType: string;
  cost: number | null;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function chitchatsHeaders() {
  return {
    Authorization: API_TOKEN,
    "Content-Type": "application/json",
  };
}

function shipmentsUrl(path = "") {
  return `${BASE_URL}/clients/${CLIENT_ID}/shipments${path}`;
}

/**
 * Map zone code to the correct Chit Chats postage_type.
 *
 * Available postage types:
 *   Canada → chit_chats_canada_tracked
 *   US     → chit_chats_us_tracked  (Chit Chats cross-border service)
 *   INTL   → tracked_packet_intl    (tracked international packet)
 */
export function resolvePostageType(zoneCode: ZoneCode, _weightGrams?: number): string {
  if (zoneCode === "CA") return "chit_chats_canada_tracked";
  if (zoneCode === "US") return "chit_chats_us_tracked";
  return "tracked_packet_intl";
}

/** Get ISO country code from a country name or code string */
export function getCountryCode(country: string): string {
  const match = resolveCountry(country);
  if (match) return match.code;
  // Fallback: take first 2 chars uppercased
  return country.trim().toUpperCase().slice(0, 2);
}

// ─────────────────────────────────────────────
// API Methods
// ─────────────────────────────────────────────

/**
 * Create a new shipment in Chit Chats.
 *
 * The shipment is created in "pending" state.
 * Chit Chats assigns a tracking number and label_url once
 * postage is purchased (which happens in the same call when
 * postage_type is provided).
 */
export async function createChitChatsShipment(
  payload: CreateShipmentPayload,
): Promise<ChitChatsShipment> {
  const body = {
    name: payload.name,
    address_1: payload.address1,
    address_2: payload.address2 ?? "",
    city: payload.city,
    province_code: payload.provinceCode ?? "",
    postal_code: payload.postalCode,
    country_code: payload.countryCode,
    description: payload.description,
    value: String(payload.value),
    value_currency: "cad",
    package_type: "parcel",
    size_unit: "cm",
    // Sensible defaults — adjust if you capture dimensions
    size_x: 15,
    size_y: 10,
    size_z: 5,
    weight_unit: "g",
    weight: payload.weightGrams,
    postage_type: payload.postageType,
    ship_date: payload.shipDate ?? "today",
    // Store your order ID as a reference for reconciliation
    reference: payload.reference ?? undefined,
  };

  const res = await fetch(shipmentsUrl(), {
    method: "POST",
    headers: chitchatsHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Chit Chats createShipment failed (${res.status}): ${errorText}`,
    );
  }

  const json = await res.json();
  // Chit Chats wraps the response in a "shipment" key
  return (json.shipment ?? json) as ChitChatsShipment;
}

/**
 * Purchase postage / buy label for an existing shipment.
 *
 * In the Chit Chats flow, postage is usually purchased at
 * creation time. This endpoint is for when you created a shipment
 * without a postage_type, or want to re-purchase.
 */
export async function buyChitChatsLabel(
  shipmentId: string,
  postageType: string,
): Promise<BuyLabelResult> {
  // PATCH the shipment to add/update the postage_type
  const res = await fetch(shipmentsUrl(`/${shipmentId}/buy_postage`), {
    method: "POST",
    headers: chitchatsHeaders(),
    body: JSON.stringify({ postage_type: postageType }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Chit Chats buyLabel failed (${res.status}): ${errorText}`,
    );
  }

  const json = await res.json();
  const shipment = (json.shipment ?? json) as ChitChatsShipment;

  return {
    shipmentId: shipment.id,
    trackingNumber: shipment.tracking_number ?? "",
    labelUrl: shipment.label_url ?? "",
    carrier: "Chit Chats",
    postageType: shipment.postage_type,
    cost: shipment.postage_rate ?? null,
  };
}

/**
 * Fetch a single shipment from Chit Chats by its external ID.
 * Useful for refreshing tracking status.
 */
export async function getChitChatsShipment(
  shipmentId: string,
): Promise<ChitChatsShipment> {
  const res = await fetch(shipmentsUrl(`/${shipmentId}`), {
    method: "GET",
    headers: chitchatsHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Chit Chats getShipment failed (${res.status}): ${errorText}`,
    );
  }

  const json = await res.json();
  return (json.shipment ?? json) as ChitChatsShipment;
}

/**
 * Validate that the Chit Chats env vars are configured.
 * Call this at server startup or in route handlers to give
 * a clear error instead of a cryptic 401.
 */
export function assertChitChatsConfig() {
  if (!CLIENT_ID) throw new Error("CHITCHATS_CLIENT_ID is not set");
  if (!API_TOKEN) throw new Error("CHITCHATS_API_TOKEN is not set");
}
