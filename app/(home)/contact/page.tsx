"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("subject", formData.subject);
      formDataObj.append("message", formData.message);
      formDataObj.append("access_key", "fa25ea99-e604-4c39-8726-da5bc667852f");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitted(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      detail: "info@revivalglowcare.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      detail: "+1 (555) 123-4567",
      description: "Monday - Friday, 9am - 6pm EST",
    },
    {
      icon: MapPin,
      title: "Address",
      detail: "123 Natural Beauty Lane",
      description: "Wellness City, WC 12345, USA",
    },
    {
      icon: Clock,
      title: "Business Hours",
      detail: "Mon - Fri: 9am - 6pm",
      description: "Sat - Sun: 10am - 4pm EST",
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
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We'd love to hear from you. Whether you have questions about our
            products or want to share your Revival Glow journey, we're here to
            help.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <IconComponent className="text-amber-600" size={28} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {info.title}
                  </h3>
                  <p className="font-medium text-amber-700 mb-1">
                    {info.detail}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-background to-amber-50/20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              Send us a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg border border-border shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background"
                  placeholder="How can we help?"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-background resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitted}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  submitted
                    ? "bg-green-500 text-white"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {submitted ? "Message Sent Successfully!" : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                q: "What is Revival Glow's return policy?",
                a: "We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact us for a full refund.",
              },
              {
                q: "How long does shipping usually take?",
                a: "Standard shipping takes 5-7 business days. We also offer expedited 2-3 day shipping options.",
              },
              {
                q: "Are your products suitable for all hair types?",
                a: "Yes! Our products are formulated for all hair types and textures. Each product is labeled with compatibility information.",
              },
              {
                q: "Do you offer international shipping?",
                a: "We currently ship to most countries. Shipping costs and times vary by location.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white border border-border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
