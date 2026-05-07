"use client";

import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HolographicHelp } from "./HolographicHelp";

export function VideoTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showGlint, setShowGlint] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('es'); // Default to Spanish as per site preference
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });

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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

  useEffect(() => {
    if (inView) {
      if (!hasShownOnce) {
        clearTimers();
        timerRef.current = setTimeout(() => setIsVisible(true), 2000);
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

  // Bilingual Loop for Video
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
        {showGlint && !isVisible && hasPassedHero && inView && (
          <HolographicHelp onClick={restartTutorial} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 ${isMobile ? 'z-[500]' : 'z-[200]'} pointer-events-none overflow-hidden flex items-start justify-center`}
          >
            <div className={`relative w-full h-full max-w-[1400px] mx-auto ${isMobile ? 'px-4 pt-[0%] translate-y-[0px]' : 'px-10 pt-[5%] translate-y-[-100px]'} transform`}>
              
              {/* Pointer to Play Button (Center-ish) */}
              <VideoArrow 
                left={isMobile ? "50%" : "40%"} 
                top={isMobile ? "48%" : "42%"} 
                rotate={isMobile ? 120 : 90} 
                delay={0.5} 
                duration={4} 
                scale={isMobile ? 0.6 : 1}
              />
              
              {/* Pointer to Video Selection */}
              <VideoArrow 
                right={isMobile ? "10%" : "15%"} 
                top={isMobile ? "70%" : "75%"} 
                rotate={isMobile ? 180 : 160} 
                delay={0.8} 
                duration={4} 
                scale={isMobile ? 0.6 : 1}
              />
              
              {/* Pointer to Like Buttons */}
              <VideoArrow 
                left={isMobile ? "65%" : "40%"} 
                top={isMobile ? "60%" : "82%"} 
                rotate={isMobile ? -60 : -45} 
                delay={1.1} 
                duration={4} 
                scale={isMobile ? 0.6 : 1}
              />
              
              {/* Pointer to specific Subscribe Button */}
              <VideoArrow 
                left={isMobile ? "35%" : "32%"} 
                top={isMobile ? "60%" : "82%"} 
                rotate={isMobile ? -30 : -20} 
                delay={1.3} 
                duration={4} 
                scale={isMobile ? 0.6 : 1}
              />

              {/* Instructional Message */}
              <div className={`absolute ${isMobile ? 'top-[35%] left-[50%] -translate-x-1/2 items-center text-center w-[90%]' : 'top-[35%] left-[35%] items-start text-left max-w-[600px]'} flex flex-col`}>
                <motion.div
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  className="relative flex flex-col items-start gap-6"
                >
                  <div className="absolute inset-x-0 inset-y-[-60px] bg-[radial-gradient(circle,rgba(0,0,0,0.95)_0%,transparent_80%)] -z-10 blur-3xl" />
                  
                  <motion.div
                    animate={{ x: ["-25%", "125%", "-25%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    onUpdate={(latest: any) => {
                      const event = new CustomEvent('videoFlashlightMove', { detail: { x: parseFloat(latest.x) } });
                      window.dispatchEvent(event);
                    }}
                  />

                  <div 
                    className="font-sketch text-[10px] md:text-sm text-center md:text-left select-none relative z-20"
                    style={{
                      color: "#ffffff",
                      textShadow: "0 0 10px rgba(255,255,255,0.4), 0 0 20px rgba(10,92,68,0.2)",
                      WebkitMaskImage: isMobile ? "none" : "radial-gradient(circle 100px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)",
                      maskImage: isMobile ? "none" : "radial-gradient(circle 100px at var(--light-x, 50%) 50%, black 0%, rgba(0,0,0,0.3) 100%)"
                    }}
                  >
                    <div className={`relative flex flex-col gap-4 ${isMobile ? 'items-center' : 'items-start'} min-h-[80px] md:min-h-[120px]`}>
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
                          <div className={`flex flex-wrap ${isMobile ? 'justify-center' : 'justify-start'}`}>
                            {(lang === 'en' ? "Interact." : "Interactúa.").split('').map((char, index) => (
                              <VideoCharacter key={`p1-${lang}-${index}`} char={char} totalChars={40} index={index} isMobile={isMobile} />
                            ))}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side Hint (Video Selection) */}
              {!isMobile && (
                <div className="absolute top-[68%] right-[2%] flex flex-col items-end max-w-[300px]">
                  <motion.div
                    initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.8 }}
                    className="relative flex flex-col items-end gap-2"
                  >
                    <div className="absolute inset-x-0 inset-y-[-40px] bg-[radial-gradient(circle,rgba(0,0,0,0.8)_0%,transparent_80%)] -z-10 blur-2xl" />
                    
                    <div 
                      className="font-sketch text-[8px] md:text-sm text-right select-none relative z-20"
                      style={{
                        color: "#ffffff",
                        textShadow: "0 0 10px rgba(255,255,255,0.4)",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={lang}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {lang === 'en' ? "Select another broadcast." : "Selecciona otro video."}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoArrow({ left, right, top, rotate, delay, duration, scale: baseScale = 1 }: { left?: string, right?: string, top: string, rotate: number, delay: number, duration: number, scale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 * baseScale, rotate: rotate - 20 }}
      animate={{ 
        opacity: [0, 0.6, 0.6, 0],
        scale: [0.5 * baseScale, baseScale, baseScale, 0.5 * baseScale],
        rotate: [rotate - 20, rotate, rotate, rotate + 10]
      }}
      transition={{ delay, duration, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
      className="absolute z-20 text-sketch-green"
      style={{ left, right, top }}
    >
      <motion.div animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <svg width={60 * baseScale} height={40 * baseScale} viewBox="0 0 60 40" fill="none" className="overflow-visible filter drop-shadow-[0_0_8px_rgba(10,92,68,0.4)]">
          <path d="M5 20C5 20 25 20 50 20M50 20L40 10M50 20L40 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function VideoCharacter({ char, totalChars, index, isMobile }: { char: string, totalChars: number, index: number, isMobile: boolean }) {
  const [intensity, setIntensity] = useState(0);
  useEffect(() => {
    if (isMobile) {
      setIntensity(0.5); // Static intensity on mobile or driven by scroll/auto
      return;
    }
    const handleMove = (e: any) => {
      const lightX = e.detail.x;
      const charX = (index / totalChars) * 100;
      const distance = Math.abs(lightX - charX);
      setIntensity(Math.max(0, 1 - distance / 25));
    };
    window.addEventListener('videoFlashlightMove', handleMove);
    return () => window.removeEventListener('videoFlashlightMove', handleMove);
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
        textShadow: `0 0 ${15 + intensity * 25}px rgba(10,92,68,${0.4 + intensity * 0.5})`
      }}
      transition={{ type: "spring", stiffness: 150, damping: 25 }}
      className="inline-block whitespace-pre"
    >
      {char}
    </motion.span>
  );
}
