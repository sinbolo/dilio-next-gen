"use client";

import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HolographicHelp } from "./HolographicHelp";

// Fire Ember Particle
function Ember({ delay, color = "#60ffdb" }: { delay: number, color?: string }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ 
        y: -40 - Math.random() * 40, 
        x: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 0
      }}
      transition={{ 
        duration: 2 + Math.random() * 1.5, 
        repeat: Infinity, 
        delay 
      }}
      className="absolute w-[2px] h-[2px] rounded-full blur-[0.5px]"
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 4px ${color}, 0 0 8px ${color}`
      }}
    />
  );
}

export function BookingTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.6 });
  const { scrollY } = useScroll();
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

  useEffect(() => {
    if (inView) {
      // Show help button after 2 seconds if not already visible
      const timer = setTimeout(() => setShowHelpButton(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setShowHelpButton(false);
      setIsHighlighting(false);
    }
  }, [inView]);

  const handleHelpClick = () => {
    setIsVisible(true);
    setIsHighlighting(true);
    // Auto-hide tutorial after 8 seconds
    setTimeout(() => {
      setIsVisible(false);
      setIsHighlighting(false);
    }, 8000);
  };

  const arrows = [
    { id: "email", top: "12%", left: "-60px", color: "#60ffdb" },
    { id: "submit", top: "88%", left: "-60px", color: "#52ff88" }
  ];

  return (
    <div ref={sectionRef} className="absolute inset-0 pointer-events-none z-50">
      {/* Floating Holographic Help Button */}
      <AnimatePresence>
        {showHelpButton && !isVisible && inView && hasPassedHero && (
          <HolographicHelp onClick={handleHelpClick} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* 1. MAGICAL ARROWS */}
            {arrows.map((arrow, idx) => (
              <motion.div
                key={arrow.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: idx * 0.3, duration: 1 }}
                className="absolute flex items-center"
                style={{ top: arrow.top, left: arrow.left }}
              >
                <div className="relative">
                  {[...Array(6)].map((_, i) => (
                    <Ember key={i} delay={i * 0.3} color={arrow.color} />
                  ))}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center origin-left"
                  >
                    <div className="w-24 h-[1px]" style={{ background: `linear-gradient(to right, ${arrow.color}, transparent)` }} />
                    <div 
                      className="w-2 h-2 rounded-full blur-[3px]" 
                      style={{ backgroundColor: arrow.color, boxShadow: `0 0 15px ${arrow.color}` }} 
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* 2. PREMIUM FORM HIGHLIGHT EFFECT (Sequential Neon Glow) */}
            <div className="absolute inset-0 flex flex-col gap-6 py-2">
              {/* Email Field Highlight */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighting ? [0, 0.4, 0] : 0 }}
                transition={{ duration: 2, repeat: 2, delay: 0.5 }}
                className="w-full h-12 border border-[#60ffdb] rounded-lg shadow-[0_0_20px_rgba(96,255,219,0.3)]"
                style={{ marginTop: "28px" }} // Align with Email input in ContactForm
              />
              
              {/* Textarea Area Highlight */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighting ? [0, 0.4, 0] : 0 }}
                transition={{ duration: 2, repeat: 2, delay: 1 }}
                className="w-full h-[120px] border border-[#52ff88] rounded-lg shadow-[0_0_20px_rgba(82,255,136,0.3)]"
                style={{ marginTop: "12px" }}
              />

              {/* Submit Button Highlight */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHighlighting ? [0, 0.6, 0] : 0 }}
                transition={{ duration: 2, repeat: 2, delay: 1.5 }}
                className="w-full h-14 bg-gradient-to-r from-[#60ffdb]/20 to-[#52ff88]/20 rounded-lg shadow-[0_0_30px_rgba(82,255,136,0.4)]"
                style={{ marginTop: "20px" }}
              />
            </div>

            {/* 3. NEON SCAN LINE (Cinematic Sweep) */}
            <motion.div
              initial={{ top: "0%", opacity: 0 }}
              animate={{ top: ["0%", "100%"], opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#60ffdb] to-transparent blur-[2px]"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
