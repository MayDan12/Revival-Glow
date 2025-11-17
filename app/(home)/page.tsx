import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/featured-products";
import { TestimonialsSection } from "@/components/testimonial-section";
import { CategorySection } from "@/components/category-section";
import { Example } from "@/components/home/support";
import { Faq } from "@/components/home/faq";
import CarouselProducts from "@/components/home/carousel";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ProductCarousel } from "@/components/product-carousel";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />

      {/* <CarouselProducts /> */}
      <ProductCarousel />

      <TestimonialsSection />
      <div className="flex flex-col-reverse md:flex-row px-6 md:px-12 lg:px-24 py-12 bg-primary/60">
        <Example />
        <Separator orientation="vertical" className="bg-amber-50" />

        <Faq />
      </div>
    </main>
  );
}
