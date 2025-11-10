// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";
// import { CartDrawer } from "./cart-drawer";
// import { motion } from "framer-motion";
// import Image from "next/image";

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Link href="/" className="flex items-center space-x-1">
//               <Image
//                 src="/revivalglow.png"
//                 alt="Revival Glow"
//                 width={70}
//                 height={70}
//               />
//               {/* <div className="text-2xl font-serif text-foreground">
//                 {"Revival Glow"}
//               </div> */}
//             </Link>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {["Products", "About", "Contact"].map((item, index) => (
//               <motion.div
//                 key={item}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//               >
//                 <Link
//                   href={`/${item.toLowerCase()}`}
//                   className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {item}
//                 </Link>
//               </motion.div>
//             ))}
//           </nav>

//           {/* Right side actions */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:block">
//               <CartDrawer />
//             </div>

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="md:hidden"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               {isMenuOpen ? (
//                 <X className="h-4 w-4" />
//               ) : (
//                 <Menu className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="md:hidden py-4 border-t border-border"
//           >
//             <nav className="flex flex-col space-y-4">
//               <Link
//                 href="/products"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Products
//               </Link>
//               <Link
//                 href="/about"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link
//                 href="/contact"
//                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
//               <div className="pt-2">
//                 <CartDrawer />
//               </div>
//             </nav>
//           </motion.div>
//         )}
//       </div>
//     </header>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // mark mounted so portal can render (avoids SSR mismatch)
    setMounted(true);
  }, []);

  // lock scroll while menu open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((s) => !s);

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  // portal overlay (render only in browser)
  const overlay = (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          key="mobile-overlay"
          className="fixed inset-0 z-[9999] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu} // clicking overlay closes it
        >
          {/* semi transparent background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* the actual drawer */}
          <motion.nav
            className="absolute top-0 right-0 w-80 max-w-[80vw] h-full bg-background border-l border-border p-6 flex flex-col space-y-6 z-[10000]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            transition={{ type: "tween", duration: 0.28 }}
            onClick={(e) => e.stopPropagation()} // don't close when clicking inside drawer
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center space-x-2"
              >
                <Image
                  src="/revivalglow.png"
                  alt="Revival"
                  width={48}
                  height={48}
                />
                <span className="font-medium text-lg">Revival Glow</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="hover:bg-primary"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMenu}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-1">
                <Image
                  src="/revivalglow.png"
                  alt="Revival Glow"
                  width={70}
                  height={70}
                />
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {["Products", "About", "Contact"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* desktop cart */}
              <div className="">
                <CartDrawer />
              </div>
              {/* mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-primary"
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* render overlay/drawer into document.body via portal so it floats above everything */}
      {mounted && typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </>
  );
}
