// components/WhatsAppButton.tsx
"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function WhatsAppButton() {
  const whatsappNumber = "2348113777257"; // change to your WhatsApp number
  const message = encodeURIComponent(
    "Hello! I’d like to know more about your products."
  );

  return (
    <Link
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-105"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
      <MessageCircle size={24} className="relative z-10" />
      <span className="relative z-10 hidden text-sm font-medium sm:block">
        Chat with us
      </span>
    </Link>
  );
}
