import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import WhatsAppButton from "@/components/home/whatappbutton";

export const metadata: Metadata = {
  title: "Pure Skincare - Natural Beauty Products",
  description:
    "Premium skincare products with natural ingredients for radiant, healthy skin.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </section>
  );
}
