"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HolographicHelp } from "./HolographicHelp";

export function MenuTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showGlint, setShowGlint] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollY } = useScroll();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

  useEffect(() => {
    if (inView) {
      if (!hasShownOnce) {
        clearTimers();
        timerRef.current = setTimeout(() => setIsVisible(true), 1000);
      } else if (!isVisible) {
        setShowGlint(true);
      }
    } else {
      setIsVisible(false);
      setShowGlint(false);
      clearTimers();
    }
  }, [inView, hasShownOnce, isVisible]);

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

  const currentText = lang === 'en' 
    ? "Navigate the ecosystem. Select a destination or scroll to continue" 
    : "Navega por el ecosistema. Selecciona un destino o scroll para continuar";

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
            className="absolute inset-0 z-[200] pointer-events-none overflow-hidden flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-[1400px] mx-auto px-10">
              
              {/* Surgically Aligned Arrows with Folder Centers */}
              {/* Precisely Aligned Arrows with NEW Folder Positions */}
              <Arrow left="12%" top={isMobile ? "20%" : "32%"} rotate={0} delay={isFast ? 0.2 : 0.5} /> {/* Music */}
              <Arrow left="5%" top={isMobile ? "38%" : "62%"} rotate={0} delay={isFast ? 0.4 : 0.8} /> {/* Video */}
              <Arrow right="15%" top={isMobile ? "25%" : "42%"} rotate={180} delay={isFast ? 0.6 : 1.5} /> {/* Tour */}
              <Arrow left={isMobile ? "60%" : undefined} right={isMobile ? undefined : "25%"} top={isMobile ? "42%" : "55%"} rotate={isMobile ? 0 : 180} delay={isFast ? 0.8 : 1.5} /> {/* Bio */}
              <Arrow left="15%" top={isMobile ? "52%" : "68%"} rotate={0} delay={isFast ? 1.0 : 2.0} /> {/* Merch */}
              <Arrow right="25%" top={isMobile ? "56%" : "79%"} rotate={180} delay={isFast ? 1.2 : 2.0} /> {/* Redes */}

              {/* Instructional Message */}
              <div className={`absolute ${isMobile ? 'top-[28%]' : 'top-[35%]'} left-[10%] md:left-[2%] flex flex-col items-start max-w-[600px]`}>
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  className="relative flex flex-col items-start gap-6"
                >
                  <div className="absolute inset-x-0 inset-y-[-60px] bg-[radial-gradient(circle,rgba(0,0,0,0.95)_0%,transparent_80%)] -z-10 blur-3xl" />
                  
                  {/* Flashlight Driver */}
                  <motion.div
                    animate={{ x: ["-25%", "125%", "-25%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    onUpdate={(latest: any) => {
                      const el = document.getElementById("menu-tutorial-sync-box");
                      if (el) el.style.setProperty("--light-x", latest.x);
                      const event = new CustomEvent('menuFlashlightMove', { detail: { x: parseFloat(latest.x) } });
                      window.dispatchEvent(event);
                    }}
                  />

                  <div 
                    className="font-sketch text-[10px] md:text-xl text-left select-none relative z-20"
                    style={{
                      color: "#3dffb8",
                      textShadow: "0 0 15px rgba(61,255,184,0.8), 0 0 30px rgba(61,255,184,0.4)",
                      WebkitMaskImage: "radial-gradient(circle 100px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)",
                      maskImage: "radial-gradient(circle 100px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)"
                    }}
                  >
                    <div id="menu-tutorial-sync-box" className="relative flex flex-col gap-4 items-start min-h-[120px]">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={lang}
                          className="flex flex-col gap-2 items-start"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={{
                            visible: { transition: { staggerChildren: 0.02 } },
                            exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } }
                          }}
                        >
                          <div className="flex flex-wrap">
                            {(lang === 'en' ? "Navigate the artistic ecosystem." : "Navega por el ecosistema artístico.").split('').map((char, index) => (
                              <MenuCharacter key={`p1-${lang}-${index}`} char={char} totalChars={currentText.length} index={index} />
                            ))}
                          </div>
                          <div className="flex flex-wrap mt-2">
                            {(lang === 'en' ? "Select a destination or scroll to continue the journey." : "Selecciona un destino o haz scroll para continuar el viaje.").split('').map((char, index) => (
                              <MenuCharacter key={`p2-${lang}-${index}`} char={char} totalChars={currentText.length} index={index + 30} />
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

function Arrow({ left, right, top, rotate, delay }: { left?: string, right?: string, top: string, rotate: number, delay: number }) {
  // Check for mobile inside Arrow component too
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 20 }}
      animate={{ 
        opacity: [0, 0.6, 0.6, 0],
        scale: isMobile ? [0.3, 0.6, 0.6, 0.3] : [0.5, 1, 1, 0.5],
        rotate: [rotate - 20, rotate, rotate, rotate + 10]
      }}
      transition={{ delay, duration: 3, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
      className="absolute z-20 text-sketch-green"
      style={{ left, right, top }}
    >
      <motion.div animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <svg width={isMobile ? "36" : "60"} height={isMobile ? "24" : "40"} viewBox="0 0 60 40" fill="none" className="overflow-visible filter drop-shadow-[0_0_8px_rgba(61,255,184,0.4)]">
          <path d="M5 20C5 20 25 20 50 20M50 20L40 10M50 20L40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function MenuCharacter({ char, totalChars, index }: { char: string, totalChars: number, index: number }) {
  const [intensity, setIntensity] = useState(0);
  useEffect(() => {
    const handleMove = (e: any) => {
      const lightX = e.detail.x;
      const charX = (index / totalChars) * 100;
      const distance = Math.abs(lightX - charX);
      setIntensity(Math.max(0, 1 - distance / 25));
    };
    window.addEventListener('menuFlashlightMove', handleMove);
    return () => window.removeEventListener('menuFlashlightMove', handleMove);
  }, [index, totalChars]);

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, filter: "blur(12px)", scale: 0.9 },
        visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
        exit: { opacity: 0, filter: "blur(8px)", y: -5 }
      }}
      animate={{ 
        scale: 1 + intensity * 0.1,
        filter: `brightness(${1 + intensity * 0.8})`,
        textShadow: `0 0 ${15 + intensity * 25}px rgba(61,255,184,${0.4 + intensity * 0.5})`
      }}
      transition={{ type: "spring", stiffness: 150, damping: 25, filter: { duration: 0.2 } }}
      className="inline-block whitespace-pre"
    >
      {char}
    </motion.span>
  );
}
