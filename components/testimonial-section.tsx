"use client";

import { easeOut, motion } from "framer-motion";
import { Star } from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export function TestimonialsSection() {
  return (
    <section className="py-10 px-4 md:px-8 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Loved by Our Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who've experienced the Revival Glow
            transformation
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
