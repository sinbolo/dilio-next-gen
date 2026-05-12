"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import { WorldScroll } from "@/components/ui/WorldScroll";
import { useEffect, useState } from "react";

export function BookingWidget() {
  const [isContactInView, setIsContactInView] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'section-6-contact') {
            setIsContactInView(entry.isIntersecting);
          }
          if (entry.target.id === 'section-1-hero') {
            setIsHeroInView(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 }
    );

    const bookingSection = document.getElementById('section-6-contact');
    const heroSection = document.getElementById('section-1-hero');
    
    if (bookingSection) observer.observe(bookingSection);
    if (heroSection) observer.observe(heroSection);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Show if NOT in contact section AND (if mobile, NOT in hero section)
  const isVisible = !isContactInView && !(isMobile && isHeroInView);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed -right-[85px] md:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-[200px] h-[200px] pointer-events-none z-[30] scale-[0.15] md:scale-100"
        >
          <WorldScroll />
          <div className="relative group cursor-pointer pointer-events-auto z-[30] flex items-center justify-center w-full h-full">
            {/* Orbital animation for airplane */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-[-40px] pointer-events-none rounded-full flex items-center justify-center"
            >
              <div className="w-[120px] h-[120px] border border-black/10 rounded-full flex items-start justify-center">
                 <Plane 
                   size={18} 
                   className="text-[#22c55e] transform -translate-y-2 opacity-50 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                   strokeWidth={1.5}
                   style={{ transform: "translateY(-50%) rotate(90deg)" }} 
                 />
              </div>
            </motion.div>

            {/* Central button */}
            <div className="relative rotate-90 text-[#22c55e] font-display text-sm tracking-[0.3em] font-bold cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <a href="#section-6-contact" className="hover:opacity-70 transition-opacity whitespace-nowrap">
                BOOKING
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
