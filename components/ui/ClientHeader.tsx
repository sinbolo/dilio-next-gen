"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag } from "lucide-react";
import { Navbar3DLogo } from "./Navbar3DLogo";

export function ClientHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the logo appearance after the first cinematic section is cleared (200vh)
      // and we are landing on Section 2
      if (window.scrollY > window.innerHeight * 1.8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 w-full px-8 py-2 flex justify-between items-center z-[2000] glassmorphism border-b border-white/5">
      <div className="flex-1">
      </div>
      
      {/* Central DILIO Logo working as a Home button */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div 
          className="transition-all duration-700 ease-in-out"
          style={{ 
            opacity: isScrolled ? 1 : 0,
            transform: isScrolled ? 'translateY(0)' : 'translateY(-10px)',
            pointerEvents: isScrolled ? 'auto' : 'none'
          }}
        >
          <Navbar3DLogo onClick={scrollToTop} />
        </div>
      </div>
      
      <div className="flex-1 flex justify-end items-center gap-6">
        <button 
           onClick={() => setIsCartOpen(true)}
           className="flex items-center gap-2 hover:text-[#22c55e] transition-colors cursor-pointer"
        >
          <ShoppingBag size={20} />
          <span className="label-xs font-bold tracking-widest uppercase mt-[2px]">({totalItems})</span>
        </button>
      </div>
    </header>
  );
}
