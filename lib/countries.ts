/**
 * Chit Chats Supported Countries
 *
 * This is the canonical list of countries Revival Glow ships to via Chit Chats.
 * Used in:
 *  - Checkout page country dropdown
 *  - Shipping zone resolution (CA / US / INTL)
 *  - Chit Chats shipment creation
 *
 * Reference: https://chitchats.com/help/supported-countries
 *
 * ⚠️  Denmark (DK) and Luxembourg (LU) are marked as potentially unavailable
 *     due to EU policy changes. They are still included here but flagged.
 */

export type ZoneCode = "CA" | "US" | "INTL";

export interface SupportedCountry {
  name: string;
  /** ISO 3166-1 alpha-2 code */
  code: string;
  zone: ZoneCode;
  /** If true, service may be temporarily unavailable — check before purchasing */
  mayBeUnavailable?: boolean;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  // ── Canada ───────────────────────────────────────────────────
  { name: "Canada", code: "CA", zone: "CA" },

  // ── United States ─────────────────────────────────────────────
  { name: "United States", code: "US", zone: "US" },

  // ── International ─────────────────────────────────────────────
  { name: "Australia", code: "AU", zone: "INTL" },
  { name: "Austria", code: "AT", zone: "INTL" },
  { name: "Belarus", code: "BY", zone: "INTL" },
  { name: "Belgium", code: "BE", zone: "INTL" },
  { name: "Brazil", code: "BR", zone: "INTL" },
  { name: "Bulgaria", code: "BG", zone: "INTL" },
  { name: "Croatia", code: "HR", zone: "INTL" },
  { name: "Czechia", code: "CZ", zone: "INTL" },
  { name: "Denmark", code: "DK", zone: "INTL", mayBeUnavailable: true },
  { name: "Estonia", code: "EE", zone: "INTL" },
  { name: "Finland", code: "FI", zone: "INTL" },
  { name: "France", code: "FR", zone: "INTL" },
  { name: "Germany", code: "DE", zone: "INTL" },
  { name: "Gibraltar", code: "GI", zone: "INTL" },
  { name: "Great Britain (United Kingdom)", code: "GB", zone: "INTL" },
  { name: "Greece", code: "GR", zone: "INTL" },
  { name: "Hong Kong", code: "HK", zone: "INTL" },
  { name: "Hungary", code: "HU", zone: "INTL" },
  { name: "Iceland", code: "IS", zone: "INTL" },
  { name: "India", code: "IN", zone: "INTL" },
  { name: "Indonesia", code: "ID", zone: "INTL" },
  { name: "Ireland", code: "IE", zone: "INTL" },
  { name: "Israel", code: "IL", zone: "INTL" },
  { name: "Italy", code: "IT", zone: "INTL" },
  { name: "Japan", code: "JP", zone: "INTL" },
  { name: "Lebanon", code: "LB", zone: "INTL" },
  { name: "Lithuania", code: "LT", zone: "INTL" },
  { name: "Luxembourg", code: "LU", zone: "INTL", mayBeUnavailable: true },
  { name: "Malaysia", code: "MY", zone: "INTL" },
  { name: "Malta", code: "MT", zone: "INTL" },
  { name: "Mexico", code: "MX", zone: "INTL" },
  { name: "Netherlands", code: "NL", zone: "INTL" },
  { name: "New Zealand", code: "NZ", zone: "INTL" },
  { name: "Norway", code: "NO", zone: "INTL" },
  { name: "Poland", code: "PL", zone: "INTL" },
  { name: "Portugal", code: "PT", zone: "INTL" },
  { name: "Romania", code: "RO", zone: "INTL" },
  { name: "Russian Federation", code: "RU", zone: "INTL" },
  { name: "Saudi Arabia", code: "SA", zone: "INTL" },
  { name: "Serbia", code: "RS", zone: "INTL" },
  { name: "Singapore", code: "SG", zone: "INTL" },
  { name: "Slovakia", code: "SK", zone: "INTL" },
  { name: "Slovenia", code: "SI", zone: "INTL" },
  { name: "South Korea", code: "KR", zone: "INTL" },
  { name: "Spain", code: "ES", zone: "INTL" },
  { name: "Sweden", code: "SE", zone: "INTL" },
  { name: "Switzerland", code: "CH", zone: "INTL" },
  { name: "Taiwan", code: "TW", zone: "INTL" },
  { name: "Thailand", code: "TH", zone: "INTL" },
  { name: "Türkiye", code: "TR", zone: "INTL" },
  { name: "United Arab Emirates", code: "AE", zone: "INTL" },
  { name: "Venezuela", code: "VE", zone: "INTL" },
];

/** Fast lookup maps */
const BY_CODE = new Map(SUPPORTED_COUNTRIES.map((c) => [c.code, c]));
const BY_NAME = new Map(SUPPORTED_COUNTRIES.map((c) => [c.name.toLowerCase(), c]));

/**
 * Resolve the shipping zone for a country.
 *
 * Accepts:
 *  - ISO 2-letter code ("CA", "GB", "AU")
 *  - Full country name ("Canada", "Great Britain (United Kingdom)")
 *
 * Returns null if the country is not supported by Chit Chats.
 */
export function resolveCountry(countryInput: string): SupportedCountry | null {
  if (!countryInput) return null;
  const trimmed = countryInput.trim();

  // Try exact code match first (e.g. "CA", "US")
  const byCode = BY_CODE.get(trimmed.toUpperCase());
  if (byCode) return byCode;

  // Try exact name match (case-insensitive)
  const byName = BY_NAME.get(trimmed.toLowerCase());
  if (byName) return byName;

  // Fuzzy fallbacks for common aliases
  const lower = trimmed.toLowerCase();
  if (lower === "usa" || lower === "united states of america") return BY_CODE.get("US")!;
  if (lower === "uk" || lower === "united kingdom" || lower === "england") return BY_CODE.get("GB")!;
  if (lower === "turkey") return BY_CODE.get("TR")!;
  if (lower === "south korea" || lower === "korea, republic of") return BY_CODE.get("KR")!;
  if (lower === "taiwan, province of china") return BY_CODE.get("TW")!;
  if (lower === "hong kong sar") return BY_CODE.get("HK")!;

  return null;
}

/**
 * Get zone code for a country string. Defaults to "INTL" for unknown countries.
 * Call `resolveCountry` first if you need to validate that the country is supported.
 */
export function getZoneCode(countryInput: string): ZoneCode {
  return resolveCountry(countryInput)?.zone ?? "INTL";
}

/** Special country code for custom shipping quote requests */
export const CUSTOM_QUOTE_COUNTRY_CODE = "OTHER";
export const CUSTOM_QUOTE_COUNTRY_NAME = "Other Country (Request Shipping Quote)";

/** Check if custom shipping quote request is required for a given country string or code */
export function isCustomQuoteRequired(countryInput: string): boolean {
  if (!countryInput) return false;
  const trimmed = countryInput.trim();
  if (
    trimmed === CUSTOM_QUOTE_COUNTRY_CODE ||
    trimmed === CUSTOM_QUOTE_COUNTRY_NAME ||
    trimmed.toLowerCase().includes("request shipping quote") ||
    trimmed.toLowerCase().includes("other country")
  ) {
    return true;
  }
  return false;
}

/** Countries grouped for rendering a select dropdown */
export const COUNTRIES_BY_GROUP = {
  domestic: SUPPORTED_COUNTRIES.filter((c) => c.zone === "CA"),
  us: SUPPORTED_COUNTRIES.filter((c) => c.zone === "US"),
  international: SUPPORTED_COUNTRIES.filter((c) => c.zone === "INTL"),
  customQuote: [{ name: CUSTOM_QUOTE_COUNTRY_NAME, code: CUSTOM_QUOTE_COUNTRY_CODE, zone: "INTL" as ZoneCode }],
} as const;
