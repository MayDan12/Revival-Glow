import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Advert } from "@/components/advert";
import { Footer } from "@/components/footer";
import WhatsAppButton from "@/components/home/whatappbutton";

export const metadata: Metadata = {
  title: "RevivalGlow - Ayurvedic Beauty & Wellness",
  description:
    "Discover premium Ayurvedic products crafted with nature's finest herbs to nourish your beauty, wellness, and everyday self-care.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen">
      <Advert />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </section>
  );
}
