"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HolographicHelp } from "./HolographicHelp";

export function BioTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showGlint, setShowGlint] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const { scrollY } = useScroll();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseRef = useRef<NodeJS.Timeout | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  };

  const [hasPassedHero, setHasPassedHero] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

  useEffect(() => {
    if (inView) {
      if (!hasShownOnce) {
        clearTimers();
        timerRef.current = setTimeout(() => setIsVisible(true), 1500);
      } else if (!isVisible) {
        setShowGlint(true);
      }
    } else {
      setIsVisible(false);
      setShowGlint(false);
      clearTimers();
    }
    return () => clearTimers();
  }, [inView, hasShownOnce, isVisible]);

  // Unified Auto-Close Logic
  useEffect(() => {
    if (isVisible) {
      const duration = isFast ? 6000 : 10000;
      autoCloseRef.current = setTimeout(() => {
        setIsVisible(false);
        setShowGlint(true);
        setHasShownOnce(true);
      }, duration);
      return () => {
        if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
      };
    }
  }, [isVisible, isFast]);

  // Bilingual Loop for Bio (as requested)
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setLang(curr => curr === 'en' ? 'es' : 'en');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const restartTutorial = () => {
    clearTimers();
    setIsFast(true);
    setShowGlint(false);
    timerRef.current = setTimeout(() => setIsVisible(true), 150);
  };

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      {/* Help Glint Trigger */}
      <AnimatePresence>
        {showGlint && !isVisible && inView && hasPassedHero && (
          <HolographicHelp onClick={restartTutorial} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-[1400px] mx-auto px-4 md:px-8">
              
              {/* Arrow pointing surgically to the globe toggle - Adjusted for Mobile Centering */}
              <BioArrow 
                left={isMobile ? "0" : "4%"} 
                right={isMobile ? "0" : undefined}
                top={isMobile ? "21%" : "35%"} 
                rotate={isMobile ? 90 : 45} 
                delay={isFast ? 0.2 : 0.5} 
                center={isMobile}
              />

              {/* Instructional Message - Centered for Mobile */}
              <div className={`absolute ${isMobile ? 'top-[13%] left-1/2 -translate-x-1/2' : 'top-[40%] left-[8%] md:left-[-2%]'} flex flex-col items-center md:items-start max-w-[600px]`}>
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  className="relative flex flex-col items-start gap-4"
                >
                  <motion.div
                    animate={{ x: ["-25%", "125%", "-25%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    onUpdate={(latest: any) => {
                      const el = document.getElementById("bio-tutorial-sync-box");
                      if (el) el.style.setProperty("--light-x", latest.x);
                      const event = new CustomEvent('bioFlashlightMove', { detail: { x: parseFloat(latest.x) } });
                      window.dispatchEvent(event);
                    }}
                  />

                  <div 
                    className="font-sketch text-[9px] md:text-base text-left select-none relative z-20"
                    style={{
                      color: "#155c44", // Deep Phosphor Green for legibility on white
                      textShadow: "0 0 10px rgba(61,255,184,0.4), 0 0 20px rgba(61,255,184,0.2)",
                      WebkitMaskImage: "radial-gradient(circle 90px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.2) 100%)",
                      maskImage: "radial-gradient(circle 90px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.2) 100%)"
                    }}
                  >
                    <div id="bio-tutorial-sync-box" className="relative flex flex-col gap-2 items-start min-h-[40px]">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={lang}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={{
                            visible: { transition: { staggerChildren: 0.02 } },
                            exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } }
                          }}
                        >
                          <div className="flex flex-wrap">
                            {(lang === 'en' ? "LANGUAGE" : "IDIOMA").split('').map((char, index) => (
                              <BioCharacter key={`p1-${lang}-${index}`} char={char} totalChars={10} index={index} />
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
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

function BioArrow({ left, right, top, rotate, delay, center }: { left?: string, right?: string, top: string, rotate: number, delay: number, center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 20 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        rotate: rotate
      }}
      exit={{ opacity: 0, scale: 0.5, rotate: rotate + 10 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={`absolute z-20 text-[#155c44] ${center ? 'left-0 right-0 mx-auto w-fit' : ''}`}
      style={{ left: center ? undefined : left, right, top }}
    >
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          y: [0, -8, 0],
          filter: ["drop-shadow(0 0 8px rgba(61,255,184,0.4))", "drop-shadow(0 0 15px rgba(61,255,184,0.8))", "drop-shadow(0 0 8px rgba(61,255,184,0.4))"]
        }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="45" height="30" viewBox="0 0 60 40" fill="none" className="overflow-visible">
          <path d="M5 20C5 20 25 20 50 20M50 20L40 10M50 20L40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function BioCharacter({ char, totalChars, index }: { char: string, totalChars: number, index: number }) {
  const [intensity, setIntensity] = useState(0);
  useEffect(() => {
    const handleMove = (e: any) => {
      const lightX = e.detail.x;
      const charX = (index / totalChars) * 100;
      const distance = Math.abs(lightX - charX);
      setIntensity(Math.max(0, 1 - distance / 25));
    };
    window.addEventListener('bioFlashlightMove', handleMove);
    return () => window.removeEventListener('bioFlashlightMove', handleMove);
  }, [index, totalChars]);

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, filter: "blur(8px)", scale: 0.8, y: 10 },
        visible: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
        exit: { opacity: 0, filter: "blur(10px)", scale: 1.1, y: -10 }
      }}
      animate={{ 
        scale: 1 + intensity * 0.05,
        filter: `brightness(${1 + intensity * 0.5})`,
        textShadow: `0 0 ${5 + intensity * 10}px rgba(61,255,184,${0.2 + intensity * 0.3})`
      }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 25,
        opacity: { duration: 0.3 },
        filter: { duration: 0.2 }
      }}
      className="inline-block whitespace-pre"
    >
      {char}
    </motion.span>
  );
}
