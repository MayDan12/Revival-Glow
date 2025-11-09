// "use client";

// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { easeInOut, motion } from "framer-motion";
// import { Leaf, Heart, Sparkles } from "lucide-react";

// export default function AboutPage() {
//   const values = [
//     {
//       icon: Leaf,
//       title: "Natural Ingredients",
//       description:
//         "Handcrafted with natural oils, herbs, and plant-based ingredients inspired by African and Ayurvedic traditions.",
//     },
//     {
//       icon: Heart,
//       title: "Authentic Care",
//       description:
//         "We believe every strand deserves deep restoration and radiant beauty. Our products are made with genuine care for your hair journey.",
//     },
//     {
//       icon: Sparkles,
//       title: "Visible Results",
//       description:
//         "Experience transformative results with our scientifically-formulated blends that promote strong, healthy, and radiant hair.",
//     },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.3,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: easeInOut },
//     },
//   };

//   return (
//     <main>
//       {/* Hero Section */}
//       <section className="py-20 bg-secondary/30">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="max-w-3xl mx-auto text-center"
//           >
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 text-balance">
//               {"Revive Your Roots, Reveal Your Glow"}
//             </h1>
//             <p className="text-xl text-muted-foreground text-balance leading-relaxed">
//               {/* {
//                 "Revival Glow was born from the belief that every strand of hair deserves revival not just beauty on the surface, but deep restoration from root to tip."
//               } */}
//               At Revival Glow, we believe in healing your hair from the roots up
//               with natural and clean formulations made to bring confidence back
//               to your crown.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Brand Story */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="mb-12"
//             >
//               <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
//                 {"Our Story"}
//               </h2>
//               <p className="text-lg text-muted-foreground leading-relaxed mb-4">
//                 {
//                   "Revival Glow emerged from a deep passion for natural hair care and a commitment to honoring traditional remedies. Inspired by the wisdom of African and Ayurvedic traditions, we discovered that the most powerful solutions for hair restoration come from nature itself."
//                 }
//               </p>
//               <p className="text-lg text-muted-foreground leading-relaxed mb-4">
//                 {
//                   "We noticed that many people struggled with hair loss, dryness, and breakage — often turning to harsh chemicals that only made things worse. We believed there had to be a better way. So we set out to create products that would truly restore hair from root to tip, using only the finest natural ingredients."
//                 }
//               </p>
//               <p className="text-lg text-muted-foreground leading-relaxed">
//                 {
//                   "Today, Revival Glow stands as a testament to the power of nature, authenticity, and genuine care. Every product we create is handcrafted with intention, designed to help you revive your roots and reveal your natural glow."
//                 }
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Brand Values */}
//       <section className="py-20 bg-secondary/30">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
//               {"Our Values"}
//             </h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               {"These principles guide everything we do at Revival Glow"}
//             </p>
//           </motion.div>

//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
//           >
//             {values.map((value, index) => {
//               const Icon = value.icon;
//               return (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   className="text-center"
//                 >
//                   <div className="flex justify-center mb-4">
//                     <div className="p-3 bg-primary/10 rounded-lg">
//                       <Icon className="h-8 w-8 text-primary" />
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-medium text-foreground mb-3">
//                     {value.title}
//                   </h3>
//                   <p className="text-muted-foreground leading-relaxed">
//                     {value.description}
//                   </p>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* Brand Essence */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="max-w-3xl mx-auto"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
//               {"Our Essence"}
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {["Confidence", "Growth", "Natural Beauty", "Purity"].map(
//                 (essence, index) => (
//                   <motion.div
//                     key={essence}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                     viewport={{ once: true }}
//                     className="p-6 bg-secondary/50 rounded-lg text-center"
//                   >
//                     <p className="text-lg font-medium text-foreground">
//                       {essence}
//                     </p>
//                   </motion.div>
//                 )
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Target Audience */}
//       <section className="py-20 bg-secondary/30">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="max-w-3xl mx-auto text-center"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
//               {"Who We Serve"}
//             </h2>
//             <p className="text-lg text-muted-foreground leading-relaxed mb-6">
//               {
//                 "Revival Glow is for women and men seeking natural solutions for hair loss, dryness, or breakage. We serve those who value clean beauty, authenticity, and visible results."
//               }
//             </p>
//             <p className="text-lg text-muted-foreground leading-relaxed">
//               {
//                 "If you're on a hair journey and believe in the power of nature, you've found your community. We're here to support you every step of the way with warm, encouraging, and authentic care."
//               }
//             </p>
//           </motion.div>
//         </div>
//       </section>
//     </main>
//   );
// }
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { easeOut, motion } from "framer-motion";
import { Leaf, Heart, Sparkles, Check } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: "Clean Beauty",
      description:
        "No parabens, sulfates, or silicones just pure, natural formulations.",
    },
    {
      icon: Heart,
      title: "Natural Healing",
      description:
        "Powered by Ayurvedic and plant-based ingredients that truly work.",
    },
    {
      icon: Sparkles,
      title: "Luxury Care",
      description:
        "Elegant, effective products made to nurture both scalp and soul.",
    },
  ];

  const promises = [
    "Clean beauty — no parabens, sulfates, or silicones",
    "Natural healing — powered by Ayurvedic and plant-based ingredients",
    "Luxury care — elegant, effective, and made to nurture both scalp and soul",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-amber-50 mb-6 text-balance">
              Revive Your Roots, Reveal Your Glow
            </h1>
            <p className="text-lg text-amber-50 text-balance leading-relaxed">
              To redefine beauty through nature creating products that heal,
              grow, and glow. Revival Glow is built on the belief that
              confidence starts with care, and care begins with what you put on
              your body.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Revival Glow was born out of frustration and faith. After years
                of dealing with breakage, thinning edges, and the disappointment
                of harsh, chemical-heavy products, our founder decided to change
                the narrative.
              </p>

              <blockquote className="border-l-4 border-primary pl-6 py-2 mb-6 italic text-muted-foreground">
                "I was tired of my hair always breaking and my edges cutting
                off. I wanted to be proud of my natural hair again not just hide
                it."
              </blockquote>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                As a braider, she saw countless clients struggle with the same
                problem using product after product with no visible results.
                That's when the idea of Revival Glow was born: to create
                something different. Something real. A product that actually
                works and helps people feel confident in their natural beauty
                again.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                With the help of Ayurvedic experts and natural formulation
                partners, Roote Hair Growth Oil was created the first step
                toward restoring not just hair, but self-trust and glow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-amber-50 mb-12">
              Our Promise
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {promises.map((promise, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-1 bg-primary rounded">
                      <Check className="h-5 w-5 text-amber-50" />
                    </div>
                  </div>
                  <p className="text-lg text-amber-50 leading-relaxed">
                    {promise}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              What Drives Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide every product we create and every decision
              we make.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-amber-50 mb-8">
              Who We Serve
            </h2>
            <p className="text-lg text-amber-50 leading-relaxed mb-6">
              Revival Glow is for women and men seeking natural solutions for
              hair loss, dryness, or breakage. We serve those who value clean
              beauty, authenticity, and visible results.
            </p>

            <p className="text-lg text-amber-50 leading-relaxed mb-6">
              If you're on a hair journey and believe in the power of nature,
              you've found your community. We're here to support you with
              warmth, encouragement, and authentic care.
            </p>

            <div className="bg-primary p-8 rounded-lg border border-primary/10">
              <p className="text-center text-amber-50 font-medium">
                "We're not just a haircare brand we're a movement toward clean,
                conscious beauty."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-12">
              Our Hero Product: Roote
            </h2>

            <div className="bg-gray-800 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-medium text-amber-50 mb-4">
                Roote — Hair Growth Oil
              </h3>
              <p className="text-lg text-amber-50 leading-relaxed mb-6">
                A rich blend of botanical oils and Ayurvedic herbs that
                stimulates hair growth, strengthens roots, and restores shine to
                dull, brittle strands.
              </p>

              <h4 className="text-lg font-medium text-amber-50 mb-4">
                Key Benefits
              </h4>
              <ul className="space-y-3 mb-8">
                {[
                  "Stimulates hair growth from roots and edges",
                  "Deeply nourishes and strengthens strands to reduce breakage",
                  "Improves scalp circulation for healthier, thicker hair",
                  "Soothes the scalp and reduces flakiness or dryness",
                  "Non-greasy and lightweight, suitable for all hair types",
                  "100% natural Ayurvedic ingredients — no parabens, no sulfates, no mineral oil",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-amber-50">{benefit}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-medium text-amber-50 mb-3">
                How to Use
              </h4>
              <p className="text-amber-50 mb-4">
                Apply a few drops to your scalp and massage gently. Use 3–4
                times weekly for best results.
              </p>

              <p className="text-sm text-amber-50 italic">
                Made in India. Proudly owned in Canada.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
