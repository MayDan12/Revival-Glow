"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import { useCurrency } from "@/contexts/currency-context";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import {
  COUNTRIES_BY_GROUP,
  getZoneCode,
  resolveCountry,
  isCustomQuoteRequired,
} from "@/lib/countries";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { currentCurrency, formatPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Canada",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shipping-country");
      if (saved) {
        setFormData((prev) => ({ ...prev, country: saved }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("shipping-country", formData.country);
    } catch {}
  }, [formData.country]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizeZoneCode = (country: string) => getZoneCode(country);

  const selectedCountryInfo = resolveCountry(formData.country);

  const totalWeightKg = useMemo(() => {
    return state.items.reduce((sum, item) => {
      const weight =
        typeof (item as any).weight === "number" &&
        Number.isFinite((item as any).weight)
          ? (item as any).weight
          : 0;
      return sum + weight * item.quantity;
    }, 0);
  }, [state.items]);

  const [shipping, setShipping] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchShipping() {
      if (state.items.length === 0) {
        setShipping(0);
        return;
      }

      const zoneCode = normalizeZoneCode(formData.country);
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("max_weight, price")
        .eq("zone_code", zoneCode)
        .order("max_weight", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load shipping rates:", error);
        setShipping(0);
        return;
      }

      const rates = (data || [])
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
        rates.find((r) => totalWeightKg <= r.maxWeight) ||
        rates[rates.length - 1];
      setShipping(matched?.price ?? 0);
    }

    fetchShipping();

    return () => {
      cancelled = true;
    };
  }, [formData.country, state.items.length, totalWeightKg]);

  const isQuoteRequired = isCustomQuoteRequired(formData.country);

  const subtotal = state.total;
  const tax = subtotal * 0.08;
  const total = isQuoteRequired ? subtotal + tax : subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (isQuoteRequired) {
        // Handle Quote Request
        const res = await fetch("/api/shipping/quote-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: state.items,
            userData: formData,
          }),
        });

        const data = await res.json();
        if (data.success && data.orderId) {
          dispatch({ type: "CLEAR_CART" });
          window.location.href = `/checkout/quote-success?orderId=${data.orderId}`;
        } else {
          throw new Error(data.error || "Failed to submit quote request");
        }
      } else {
        // Handle Standard Stripe Checkout
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: state.items,
              userData: formData,
              currencyCode: currentCurrency.code,
              rate: currentCurrency.rate,
              totalAmount: total,
            }),
          },
        );

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
          throw new Error(data.error || "Failed to start checkout");
        }
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(error.message || "Something went wrong while processing your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ... rest of your component (empty cart and order complete states remain the same)

  return (
    <main className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                Products
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/cart"
                className="hover:text-foreground transition-colors"
              >
                Cart
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">Checkout</li>
          </ol>
        </nav>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif text-foreground mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {/* Country — full Chit Chats supported list */}
                  <div>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    >
                      {/* Canada */}
                      <optgroup label="Canada">
                        {COUNTRIES_BY_GROUP.domestic.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>

                      {/* United States */}
                      <optgroup label="United States">
                        {COUNTRIES_BY_GROUP.us.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>

                      {/* International */}
                      <optgroup label="International">
                        {COUNTRIES_BY_GROUP.international.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                            {c.mayBeUnavailable ? " ⚠️" : ""}
                          </option>
                        ))}
                      </optgroup>

                      {/* Custom Quote / Unsupported */}
                      <optgroup label="Other Destinations">
                        {COUNTRIES_BY_GROUP.customQuote.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    {/* Alert for Custom Quote Destinations */}
                    {isQuoteRequired && (
                      <div className="mt-3 flex items-start gap-2 text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                        <div>
                          <strong>Custom International Shipping Quote</strong>
                          <p className="mt-1 text-blue-700 text-xs leading-relaxed">
                            Because your destination is outside our standard automated carrier zones, submit your details below and our team will email you an exact shipping quote & 1-click payment link within 24 hours. No payment is charged now.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Warn for temporarily unavailable countries */}
                    {!isQuoteRequired && selectedCountryInfo?.mayBeUnavailable && (
                      <div className="mt-2 flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Shipping to <strong>{selectedCountryInfo.name}</strong> may be temporarily unavailable due to EU policy changes. We'll confirm before dispatching your order.
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : isQuoteRequired
                  ? "Submit Shipping Quote Request"
                  : `Complete Purchase - ${formatPrice(total)}`}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {isQuoteRequired ? (
                        <span className="text-blue-600 font-medium text-xs">Quote via Email</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium text-lg">
                      {isQuoteRequired ? (
                        <span className="text-sm font-normal text-muted-foreground">
                          {formatPrice(subtotal + tax)} + Shipping Quote
                        </span>
                      ) : (
                        formatPrice(total)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
