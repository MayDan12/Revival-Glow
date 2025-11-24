"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to join waitlist");
      setStatus("You're on the list! We'll notify you soon.");
      toast.success("You're on the list! We'll notify you soon.");
      setName("");
      setEmail("");
    } catch (err: any) {
      setStatus(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto border rounded-xl bg-card text-card-foreground shadow-sm p-6 md:p-8"
      >
        <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2 text-center">
          Join the Waitlist
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          Be the first to know when new drops arrive.
        </p>

        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3"
        >
          <Input
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="md:w-auto w-full">
            {loading ? "Joining..." : "Join"}
          </Button>
        </form>

        {status && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {status}
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
}
