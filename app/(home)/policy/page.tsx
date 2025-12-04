"use client";

import { motion } from "framer-motion";

export default function PolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sections = [
    {
      id: "terms",
      title: "Terms of Service",
      content: [
        {
          heading: "1. Agreement to Terms",
          text: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. Revival Glow reserves the right to make changes to this agreement at any time. Your continued use of this site following the posting of revised Terms means that you accept and agree to the changes.",
        },
        {
          heading: "2. Use License",
          text: "Permission is granted to temporarily download one copy of the materials (information or software) on Revival Glow's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on the website; remove any copyright or other proprietary notations from the materials; transfer the materials to another person or 'mirror' the materials on any other server.",
        },
        {
          heading: "3. Disclaimer",
          text: "The materials on Revival Glow's website are provided on an 'as is' basis. Revival Glow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        },
        {
          heading: "4. Limitations",
          text: "In no event shall Revival Glow or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if Revival Glow or an authorized representative has been notified orally or in writing of the possibility of such damage.",
        },
        {
          heading: "5. Accuracy of Materials",
          text: "The materials appearing on Revival Glow's website could include technical, typographical, or photographic errors. Revival Glow does not warrant that any of the materials on the website are accurate, complete, or current. Revival Glow may make changes to the materials contained on its website at any time without notice.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content: [
        {
          heading: "1. Information Collection",
          text: "Revival Glow collects information you voluntarily provide when you create an account, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, shipping address, payment information, and any other information you choose to provide. We also automatically collect certain information about your device and how you interact with our website.",
        },
        {
          heading: "2. Information Use",
          text: "We use the information we collect to process orders, deliver products, provide customer service, send promotional communications (which you can opt out of at any time), improve our website and services, prevent fraud, and comply with legal obligations. We will never sell your personal information to third parties.",
        },
        {
          heading: "3. Data Security",
          text: "Revival Glow implements industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.",
        },
        {
          heading: "4. Cookies",
          text: "Our website uses cookies to enhance your browsing experience and analyze site usage. Most web browsers are set to accept cookies by default, but you can usually modify your browser settings to decline cookies if you prefer.",
        },
        {
          heading: "5. Third-Party Links",
          text: "Revival Glow's website may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites. We encourage you to review the privacy policies of any third-party websites before providing personal information.",
        },
        {
          heading: "6. Your Rights",
          text: "You have the right to access, update, or delete your personal information at any time. You can manage your preferences in your account settings or contact us directly for assistance.",
        },
      ],
    },
    {
      id: "intellectual",
      title: "Intellectual Property Rights",
      content: [
        {
          heading: "1. Ownership",
          text: "All materials on the Revival Glow website, including text, graphics, logos, images, and software, are the property of Revival Glow or its content suppliers and are protected by international copyright laws.",
        },
        {
          heading: "2. Limited License",
          text: "We grant you a limited, non-exclusive, non-transferable license to access and use the website content for personal, non-commercial purposes only. You may not reproduce, distribute, transmit, modify, or commercially exploit any content without our prior written permission.",
        },
        {
          heading: "3. Trademarks",
          text: "Revival Glow, its logo, and all related product and service names and slogans are trademarks of Revival Glow. You may not use these trademarks without our prior written permission.",
        },
        {
          heading: "4. User-Generated Content",
          text: "By submitting reviews, testimonials, or other content to our website, you grant Revival Glow a worldwide, royalty-free license to use that content for promotional and marketing purposes.",
        },
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: [
        {
          heading: "1. No Liability for Indirect Damages",
          text: "In no event shall Revival Glow be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, even if advised of the possibility of such damages.",
        },
        {
          heading: "2. Liability Cap",
          text: "Our total liability to you for any claim arising out of or relating to these terms or the website shall not exceed the amount you paid for your purchase.",
        },
        {
          heading: "3. Product Liability",
          text: "While we stand behind the quality of our products, Revival Glow is not liable for any injuries or damages resulting from product use. Please follow all usage instructions and consult a healthcare professional if you have concerns.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: [
        {
          heading: "1. Policy Updates",
          text: "Revival Glow reserves the right to modify these terms and conditions at any time. Changes become effective immediately upon posting to the website. Your continued use of the website following any changes constitutes your acceptance of the new terms.",
        },
        {
          heading: "2. Notification",
          text: "For significant changes, we will provide notice by email or by placing a prominent notice on the website.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      content: [
        {
          heading: "Questions About Our Terms and Policies?",
          text: "If you have questions about these terms and conditions or our privacy policy, please contact us at legal@revivalglow.com or by mail at: Revival Glow, Legal Department, 123 Natural Beauty Lane, Wellness City, WC 12345, USA.",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4"
          >
            Terms of Service & Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Please read our terms, conditions, and privacy policy carefully.
            Last updated: November 2025
          </motion.p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="sticky top-25 bg-white border-b border-border z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {sections.map((section) => (
              <motion.div
                key={section.id}
                id={section.id}
                variants={sectionVariants}
                className="scroll-mt-32"
              >
                <h2 className="text-3xl font-serif font-bold text-foreground mb-8">
                  {section.title}
                </h2>

                <div className="space-y-6">
                  {section.content.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 bg-white rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {item.heading}
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 px-4 md:px-8 bg-gradient-to-r from-amber-50 to-background border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            Last Updated: November 17, 2025. These terms and conditions are
            subject to change without notice.
          </p>
        </div>
      </section>
    </main>
  );
}
