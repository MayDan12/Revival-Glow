"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

function QuoteSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <Card className="shadow-lg border-primary/20">
          <CardContent className="pt-8 pb-8 px-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">
                Shipping Quote Request Received!
              </h1>
              {orderId && (
                <p className="text-sm font-mono text-muted-foreground bg-muted py-1 px-3 rounded-full inline-block">
                  Reference: #{orderId}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you for submitting your custom international shipping quote request. Our fulfillment team is calculating the exact shipping rates for your delivery address.
            </p>

            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-left space-y-3 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-medium text-amber-800">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>What Happens Next?</span>
              </div>
              <ul className="space-y-2 text-amber-800/90 list-disc list-inside pl-1">
                <li>We will calculate the lowest carrier shipping rate for your location.</li>
                <li>You will receive an email invoice with a <strong>1-click payment link</strong> within 24 hours.</li>
                <li>Once paid, your order will be dispatched immediately.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="w-full">
                <Link href="/products" className="flex items-center justify-center gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function QuoteSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading confirmation...</div>}>
      <QuoteSuccessContent />
    </Suspense>
  );
}
