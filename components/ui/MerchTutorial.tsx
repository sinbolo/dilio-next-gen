"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// The "Ghost Spark" - A fleeting, ethereal light that replaces HolographicHelp in Merch
function GhostSpark({ onClick, lang }: { onClick: () => void, lang: 'en' | 'es' }) {
  const neonFireStyle = {
    color: "#fff",
    textShadow: `
      0 -1px 2px #fff,
      0 -2px 6px #60ffdb,
      0 -4px 12px #52ff88,
      0 -6px 20px rgba(82,255,136,0.8)
    `,
    animation: "neon-fire-flicker 2.5s infinite alternate"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.8, 0.4, 1, 0.6],
        scale: [0.8, 1, 0.9, 1.1, 1],
        x: [0, 15, -10, 8, 0],
        y: [0, -20, 10, -8, 0],
      }}
      exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="fixed bottom-24 md:bottom-32 left-4 md:left-[5%] z-[300] flex items-center gap-4 pointer-events-auto cursor-pointer"
      onClick={onClick}
    >
      {/* Ghost Core */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#60ffdb,0_0_40px_rgba(96,255,219,0.6)]"
      >
        <div className="absolute inset-0 bg-[#60ffdb] rounded-full animate-ping opacity-40" />
      </motion.div>

      {/* Help Text with Neon Fire Effect */}
      <div className="font-sketch text-[10px] tracking-[0.4em] uppercase italic opacity-80" style={neonFireStyle}>
        {lang === 'en' ? "HELP" : "AYUDA"}
      </div>

      {/* Floating Micro-sparks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-5, -25], 
            x: [0, (i - 1) * 10], 
            opacity: [0, 1, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: i * 0.5 
          }}
          className="absolute top-0 left-2 w-[2px] h-[2px] bg-[#60ffdb] rounded-full blur-[1px]"
        />
      ))}
    </motion.div>
  );
}

// Fire Ember Particle for the RE Village Text
function Ember({ delay, color = "#ff6600" }: { delay: number, color?: string }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
      animate={{ 
        y: -50 - Math.random() * 30, 
        x: (Math.random() - 0.5) * 30,
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

export function MerchTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSpark, setShowSpark] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1 });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold = isMobile ? 400 : 800;
    setHasPassedHero(latest > threshold);
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  };

  useEffect(() => {
    if (inView) {
      if (!hasShownOnce) {
        clearTimers();
        timerRef.current = setTimeout(() => setIsVisible(true), 2500);
      } else if (!isVisible) {
        setShowSpark(true);
      }
    } else {
      setIsVisible(false);
      setShowSpark(false);
      clearTimers();
    }
    return () => clearTimers();
  }, [inView, hasShownOnce, isVisible]);

  useEffect(() => {
    if (isVisible) {
      autoCloseRef.current = setTimeout(() => {
        setIsVisible(false);
        setShowSpark(true);
        setHasShownOnce(true);
      }, 12000);
      return () => clearTimers();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setLang(curr => curr === 'en' ? 'es' : 'en');
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const restartTutorial = () => {
    clearTimers();
    setShowSpark(false);
    timerRef.current = setTimeout(() => setIsVisible(true), 200);
  };

  const fireTextStyle = {
    color: "#fff",
    opacity: 0.75, // Reduced opacity for realism as requested
    textShadow: `
      0 -1px 3px #fff,
      0 -3px 8px #ff0,
      0 -6px 15px #f90,
      0 -10px 30px #c33
    `,
    animation: "fire-flicker 2s infinite alternate"
  };

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">

      <style>{`
        @keyframes fire-flicker {
          0% { text-shadow: 0 -1px 3px #fff, 0 -3px 8px #ff0, 0 -6px 15px #f90, 0 -10px 30px #c33; filter: brightness(1); }
          100% { text-shadow: 0 -2px 5px #fff, 0 -5px 12px #ff0, 0 -10px 25px #f90, 0 -15px 50px #c33; filter: brightness(1.1); }
        }
        @keyframes neon-fire-flicker {
          0% { text-shadow: 0 -1px 2px #fff, 0 -2px 6px #60ffdb, 0 -4px 12px #52ff88, 0 -6px 20px rgba(82,255,136,0.8); }
          100% { text-shadow: 0 -2px 4px #fff, 0 -4px 10px #60ffdb, 0 -8px 20px #52ff88, 0 -12px 40px rgba(82,255,136,1); }
        }
      `}</style>

      <AnimatePresence>
        {showSpark && !isVisible && inView && hasPassedHero && (
          <GhostSpark onClick={restartTutorial} lang={lang} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${isMobile ? 'z-[500]' : 'z-[200]'} pointer-events-none flex items-center justify-center`}
          >
            <div className={`relative w-full h-full max-w-[1400px] mx-auto ${isMobile ? 'px-6' : 'px-10'}`}>
              
              {/* Message Block 1: Flashlight Instruction */}
              <div className={`absolute ${isMobile ? 'top-[18%] left-1/2 -translate-x-1/2 items-center text-center w-[90%]' : 'top-[20%] left-[15%] md:left-[10%] items-start'} flex flex-col`}>
                <motion.div
                  initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(20px)", y: -20 }}
                  transition={{ duration: 1.5 }}
                  className="relative"
                >
                  <div className={`relative z-10 font-sketch ${isMobile ? 'text-[10px]' : 'text-[8px] md:text-sm'} uppercase tracking-widest italic`} style={fireTextStyle}>
                    <AnimatePresence mode="wait">
                      <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {isMobile 
                          ? (lang === 'en' ? "Touch and move to reveal." : "Toca y desliza para revelar.")
                          : (lang === 'en' ? "Reveal the invisible with light." : "Usa la luz para revelar lo invisible.")
                        }
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Embers */}
                    {[...Array(isMobile ? 5 : 10)].map((_, i) => (
                      <Ember key={i} delay={i * 0.4} />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Message Block 2: Exploration Hint */}
              <div className={`absolute ${isMobile ? 'bottom-[22%] left-1/2 -translate-x-1/2 items-center text-center w-[90%]' : 'bottom-[25%] right-[12%] items-end'} flex flex-col`}>
                <motion.div
                  initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(20px)", y: -20 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="relative"
                >
                  <div className={`relative z-10 font-sketch ${isMobile ? 'text-[10px]' : 'text-[8px] md:text-sm'} uppercase tracking-widest italic ${isMobile ? 'text-center' : 'text-right'}`} style={fireTextStyle}>
                    <AnimatePresence mode="wait">
                      <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {lang === 'en' ? "Explore the shadows." : "Explora las sombras."}
                      </motion.div>
                    </AnimatePresence>
 
                    {/* Embers */}
                    {[...Array(isMobile ? 5 : 10)].map((_, i) => (
                      <Ember key={i} delay={i * 0.4 + 0.5} />
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
