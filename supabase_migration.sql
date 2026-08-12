-- ============================================================
-- Revival Glow — Chit Chats Shipping Integration
-- Run this in your Supabase SQL editor
-- ============================================================

-- ── shipment_events table ────────────────────────────────────
-- Stores webhook tracking events from Chit Chats.
-- The shipments table already exists (user confirmed).

CREATE TABLE IF NOT EXISTS shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(100),
  description TEXT,
  location TEXT,
  event_time TIMESTAMP WITH TIME ZONE,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by shipment
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id
  ON shipment_events(shipment_id);

-- Index for time-ordered event queries
CREATE INDEX IF NOT EXISTS idx_shipment_events_event_time
  ON shipment_events(event_time DESC);

-- ── Add tracking_number column to orders ─────────────────────
-- Mirrors the tracking number from shipments for convenience
-- (some pages read it from orders directly).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- ── RLS Policies ─────────────────────────────────────────────
-- Allow the service role (server-side) to do everything.
-- Customers should NOT be able to read raw shipment data;
-- they go through /api/shipping/[orderId]/tracking instead.

ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

-- Server-side (service role) full access
CREATE POLICY "service_role_all_shipment_events"
  ON shipment_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Verify shipments table has external_label_id ─────────────
-- Your existing CREATE TABLE may not have this column.
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS external_label_id TEXT;
