import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/featured-products";
import { Footer } from "@/components/footer";
import SwipeCards from "@/components/home/testimonial";
import { TestimonialsSection } from "@/components/testimonial-section";
import { CategorySection } from "@/components/category-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialsSection />
      {/* <SwipeCards /> */}
    </main>
  );
}
