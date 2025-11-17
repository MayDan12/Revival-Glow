"use client";

import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Amara Johnson",
    role: "Hair Care Enthusiast",
    content:
      "Revival Glow transformed my hair journey. After just 3 weeks, my hair felt stronger and healthier than ever. The natural ingredients make all the difference!",
    rating: 5,
    image: "/woman-with-healthy-hair.jpg",
  },
  {
    id: 2,
    name: "Zainab Ahmed",
    role: "Natural Hair Advocate",
    content:
      "I was skeptical about natural products, but Revival Glow proved me wrong. My hair loss has significantly reduced, and my curls are more defined and vibrant.",
    rating: 5,
    image: "/woman-natural-curls.jpg",
  },
  {
    id: 3,
    name: "Marcus Williams",
    role: "Wellness Blogger",
    content:
      "The quality and authenticity of Revival Glow products are unmatched. I recommend them to everyone looking for real, visible results without harmful chemicals.",
    rating: 5,
    image: "/man-healthy-hair.jpg",
  },
  {
    id: 4,
    name: "Nia Patel",
    role: "Beauty Influencer",
    content:
      "Revival Glow is my go-to brand for all my hair care needs. The products smell amazing, feel luxurious, and actually deliver on their promises.",
    rating: 5,
    image: "/woman-glowing-skin.jpg",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Loved by Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who've experienced the Revival Glow
            transformation
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg font-serifs p-8 md:p-12 shadow-lg border border-border mb-8"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <img
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-amber-100"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex gap-1 mb-4">
                  {Array.from({
                    length: testimonials[currentIndex].rating,
                  }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-lg text-foreground/90 font-serif leading-relaxed mb-6">
                  "{testimonials[currentIndex].content}"
                </p>

                <div>
                  <h3 className="text-lg font-semibold font-serif text-foreground">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-muted-foreground font-serif">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full hover:bg-amber-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-foreground" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-amber-500 w-8"
                      : "bg-amber-200 hover:bg-amber-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-full hover:bg-amber-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-foreground" />
            </button>
          </div>

          <div className="mt-10 pt-10 border-t border-amber-600">
            <h3 className="text-2xl font-semibold font-serif text-foreground mb-8 text-center">
              More Stories
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={testimonial.id}
                  onClick={() => goToSlide(index)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-4 rounded-lg text-left transition-all ${
                    index === currentIndex
                      ? "bg-amber-50 border-2 border-amber-500"
                      : "bg-background border border-border hover:border-amber-300"
                  }`}
                >
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mb-3"
                  />
                  <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {testimonial.content}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
