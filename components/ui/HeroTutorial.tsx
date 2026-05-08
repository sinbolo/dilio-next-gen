"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroTutorial() {
  const [isVisible, setIsVisible] = useState(true);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const { scrollY } = useScroll();

  useEffect(() => {
    // Language Toggle Loop synchronized with the 4s light sweep
    const interval = setInterval(() => {
      setLang(curr => curr === 'en' ? 'es' : 'en');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Magical Exit Transforms (Ultra Range for extremely slow disappearance)
  const opacity = useTransform(scrollY, [0, 1500], [1, 0]);
  const scale = useTransform(scrollY, [0, 1500], [1, 1.4]);
  const blur = useTransform(scrollY, [0, 1500], [0, 15]);
  const yTranslate = useTransform(scrollY, [0, 1500], [0, -40]);

  const currentText = lang === 'en' ? 'Scroll to explore' : 'Scroll para explorar';

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        style={{ 
          opacity,
          scale,
          y: yTranslate,
          filter: `blur(${blur}px)`
        }}
        className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-end pb-24 md:pb-8 overflow-hidden"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="relative flex flex-col items-center gap-2 px-4 md:px-12 py-8 md:py-16"
        >
          {/* Localized Darkness Pocket for contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.95)_0%,transparent_80%)] -z-10 blur-xl" />
          
          {/* MOVING FLASHLIGHT BEAM (Autonomous Animation) */}
          <motion.div
            animate={{ 
              x: [-150, 150, -150],
              y: [-40, 60, -40],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div 
              className="w-48 h-48 rounded-full blur-[30px]"
              style={{
                background: "radial-gradient(circle, rgba(10, 92, 68, 0.8) 0%, rgba(10, 92, 68, 0.2) 50%, transparent 80%)",
                mixBlendMode: "screen"
              }}
            />
          </motion.div>

          {/* Handwritten Message with Dynamic Flashlight Mask & Chemical Proximity Reactivity */}
          <motion.div
            className="font-sketch text-[10px] md:text-xl select-none relative z-20 h-10 flex items-center justify-center"
            style={{
              color: "#051a13",
              textShadow: "0 0 15px rgba(10, 92, 68, 0.8), 0 0 30px rgba(10, 92, 68, 0.4)",
              WebkitMaskImage: "radial-gradient(circle 85px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)",
              maskImage: "radial-gradient(circle 85px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)"
            }}
          >
            <motion.div
              animate={{ x: ["-25%", "125%", "-25%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onUpdate={(latest: any) => {
                const el = document.getElementById("hero-scroll-chemical-box");
                if (el) el.style.setProperty("--light-x", latest.x);
                // Dispatch event for child letters to react
                const event = new CustomEvent('flashlightMove', { detail: { x: parseFloat(latest.x) } });
                window.dispatchEvent(event);
              }}
            />
            
            <div id="hero-scroll-chemical-box" className="relative flex items-center justify-center min-w-[340px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={lang}
                  className="flex"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
                  }}
                >
                  {currentText.split('').map((char, index) => (
                    <Character 
                      key={`${lang}-${index}`} 
                      char={char} 
                      totalChars={currentText.length} 
                      index={index} 
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Hand-Drawn Arrow */}
          <motion.div
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="mt-2 relative z-20"
            style={{
              color: "#051a13",
              filter: "drop-shadow(0 0 12px rgba(10, 92, 68, 0.5))"
            }}
          >
            <svg width="40" height="50" viewBox="0 0 60 80" fill="none" className="overflow-visible">
              <path d="M30 5C30 5 28 35 30 65M30 65C30 65 15 50 10 55M30 65C30 65 45 50 50 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Sub-component for individual character natural reaction
function Character({ char, totalChars, index }: { char: string, totalChars: number, index: number }) {
  const [intensity, setIntensity] = useState(0); // 0 to 1
  
  useEffect(() => {
    const handleMove = (e: any) => {
      const lightX = e.detail.x;
      const charX = (index / totalChars) * 100;
      const distance = Math.abs(lightX - charX);
      
      // Natural falloff curve (Gaussian-like)
      const newIntensity = Math.max(0, 1 - distance / 20);
      setIntensity(newIntensity);
    };
    window.addEventListener('flashlightMove', handleMove);
    return () => window.removeEventListener('flashlightMove', handleMove);
  }, [index, totalChars]);

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, filter: "blur(8px)", scale: 0.9 },
        visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
        exit: { opacity: 0, filter: "blur(5px)", y: -5 }
      }}
      animate={{ 
        scale: 1 + intensity * 0.12,
        filter: `brightness(${1 + intensity * 0.6}) blur(${Math.max(0, (1 - intensity) * 1.5)}px)`,
        textShadow: `0 0 ${10 + intensity * 20}px rgba(10, 92, 68,${0.3 + intensity * 0.5})`
      }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 25,
        filter: { duration: 0.3 }
      }}
      className="inline-block whitespace-pre"
    >
      {char}
    </motion.span>
  );
}


