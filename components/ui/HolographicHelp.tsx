"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function HolographicHelp({ onClick }: { onClick: () => void }) {
  const [hologramLang, setHologramLang] = useState<'HELP' | 'AYUDA'>('HELP');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      setHologramLang(curr => curr === 'HELP' ? 'AYUDA' : 'HELP');
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed left-8 bottom-8 z-[110] pointer-events-auto group"
    >
      {/* Iridescent Foil Sticker Base (Micro-Jewelry Scale) */}
      <div className="relative w-8 h-8 flex items-center justify-center rounded-full overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.6)] border-[0.3px] border-white/30">
        {/* Shifting Oil Gradient (Reactive to Mouse) */}
        <motion.div 
          animate={{ 
            filter: `hue-rotate(${mousePos.x + mousePos.y}deg)`,
            x: (mousePos.x - 50) * 0.2,
            y: (mousePos.y - 50) * 0.2
          }}
          className="absolute inset-[-50%] scale-[1.5]"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #ff00ff, #00ffff, #ffff00, #00ff00, #ff00ff)`,
            backgroundSize: "200% 200%",
          }}
        />
        
        {/* Metallic Texture Overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
        
        {/* Realistic Glossy Sweep */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
        />

        {/* The Text Label */}
        <div className="relative z-10 flex flex-col items-center justify-center mix-blend-difference">
          <AnimatePresence mode="wait">
            <motion.span
              key={hologramLang}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.4 }}
              className="font-bold text-[6px] tracking-[0.05em] text-white/90 leading-none"
            >
              {hologramLang}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle Outer Glow */}
      <div className="absolute inset-0 -z-10 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}


