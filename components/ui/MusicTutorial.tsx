"use client";

import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HolographicHelp } from "./HolographicHelp";

export function MusicTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [showGlint, setShowGlint] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollY } = useScroll();
  const [hasPassedHero, setHasPassedHero] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

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
      const duration = isFast ? 12000 : 18000;
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

  const restartTutorial = () => {
    clearTimers();
    setIsFast(true);
    setShowGlint(false);
    timerRef.current = setTimeout(() => setIsVisible(true), 150);
  };

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
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
            <div className="relative w-full h-full max-w-[1400px] mx-auto">
              
              {/* 1. PLAY Button - FIRST */}
              <MusicArrow 
                left={isMobile ? "0%" : "8%"} top={isMobile ? "82%" : "86%"} rotate={isMobile ? 180 : 0} 
                delay={isFast ? 0.5 : 1.0} 
                textEn="1. PRESS PLAY" 
                textEs="1. PULSA REPRODUCIR"
                textSide="left"
              />

              {/* 2. Waveform Seek - SECOND */}
              <MusicArrow 
                left={isMobile ? "38%" : "42%"} top="22%" rotate={90} 
                delay={isFast ? 2.5 : 4.0} 
                textEn="2. SCROLL VIA WAVEFORM" 
                textEs="2. DESPLAZA EN LA ONDA"
                textSide="bottom"
                textColor="#FFFFFF"
              />

              {/* 3. CUE Button - THIRD */}
              <MusicArrow 
                left={isMobile ? "0%" : "8%"} top={isMobile ? "72%" : "76%"} rotate={isMobile ? 180 : 0} 
                delay={isFast ? 4.5 : 7.0} 
                textEn="3. PAUSE AT CUE" 
                textEs="3. PAUSA EN CUE"
                textSide="left"
              />

              {/* 4. USB Sticks - FOURTH */}
              <MusicArrow 
                left={isMobile ? "0%" : "18%"} top="10%" rotate={90} 
                delay={isFast ? 6.5 : 10.0} 
                textEn="4. CHANGE TRACK VIA USB" 
                textEs="4. CAMBIA DE TRACK EN EL USB"
                textSide="top"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MusicArrow({ left, right, top, rotate, delay, textEn, textEs, textSide = 'bottom', hasWhiteOutline = false, textColor = "#051a13" }: { 
  left?: string, 
  right?: string, 
  top: string, 
  rotate: number, 
  delay: number,
  textEn: string,
  textEs: string,
  textSide?: 'top' | 'bottom' | 'left' | 'right',
  hasWhiteOutline?: boolean,
  textColor?: string
}) {
  const [localLang, setLocalLang] = useState<'es' | 'en'>('es');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Independent, randomized loop for each arrow
  useEffect(() => {
    const randomInterval = 3500 + Math.random() * 2000; // Between 3.5s and 5.5s
    const interval = setInterval(() => {
      setLocalLang(curr => curr === 'en' ? 'es' : 'en');
    }, randomInterval);
    return () => clearInterval(interval);
  }, []);

  const currentText = localLang === 'en' ? textEn : textEs;

  const flexDir = {
    top: 'flex-col-reverse',
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row'
  }[textSide];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={`absolute z-20 flex ${flexDir} items-center gap-6`}
      style={{ left, right, top, color: textColor }}
    >
      {/* The Arrow SVG - Rotating ONLY the arrow, not the container */}
      <motion.div 
        animate={{ 
          rotate: rotate,
          scale: [1, 1.1, 1], 
          x: textSide === 'left' ? [0, 8, 0] : textSide === 'right' ? [0, -8, 0] : 0,
          y: textSide === 'bottom' ? [0, -8, 0] : textSide === 'top' ? [0, 8, 0] : 0,
          filter: [
            `drop-shadow(0 0 8px rgba(61,255,184,0.3)) ${hasWhiteOutline ? "drop-shadow(0 0 1px rgba(255,255,255,0.6))" : ""}`,
            `drop-shadow(0 0 15px rgba(61,255,184,0.5)) ${hasWhiteOutline ? "drop-shadow(0 0 1px rgba(255,255,255,0.6))" : ""}`,
            `drop-shadow(0 0 8px rgba(61,255,184,0.3)) ${hasWhiteOutline ? "drop-shadow(0 0 1px rgba(255,255,255,0.6))" : ""}`
          ]
        }} 
        transition={{ 
          rotate: { duration: 0.8, ease: "easeOut", delay },
          default: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg 
          width={isMobile ? "32" : "60"} 
          height={isMobile ? "22" : "40"} 
          viewBox="0 0 60 40" 
          fill="none" 
          className="overflow-visible"
        >
          <path d="M5 20C5 20 25 20 50 20M50 20L40 10M50 20L40 30" stroke="currentColor" strokeWidth={isMobile ? "8" : "4"} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* The Callout Text - Always horizontal */}
      <div 
        className="font-sketch text-[9px] md:text-base text-center select-none whitespace-nowrap px-4"
        style={{
          color: textColor,
          textShadow: `
            0 0 12px rgba(61,255,184,0.4)
            ${hasWhiteOutline ? ", 0.5px 0.5px 0px rgba(255,255,255,0.5), -0.5px -0.5px 0px rgba(255,255,255,0.5)" : ""}
          `
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={localLang}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              visible: { transition: { staggerChildren: 0.02 } },
              exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } }
            }}
            className="flex justify-center"
          >
            {currentText.split('').map((char, index) => (
              <MusicCharacter 
                key={`${currentText}-${index}`} 
                char={char} 
                totalChars={currentText.length} 
                index={index} 
                delay={delay}
                hasWhiteOutline={hasWhiteOutline}
                textColor={textColor}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MusicCharacter({ char, totalChars, index, delay, hasWhiteOutline, textColor }: { 
  char: string, 
  totalChars: number, 
  index: number, 
  delay: number,
  hasWhiteOutline?: boolean,
  textColor?: string
}) {
  const [intensity, setIntensity] = useState(0);
  
  // Since we don't have a central sync box anymore, we'll use a local pulse
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const pulse = (Math.sin(time * 2 + index * 0.1) + 1) / 2;
      setIntensity(pulse);
    }, 50);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, filter: "blur(8px)", scale: 0.8, y: 5 },
        visible: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
        exit: { opacity: 0, filter: "blur(5px)", scale: 1.1, y: -5 }
      }}
      animate={{ 
        scale: 1 + intensity * 0.05,
        filter: `brightness(${1 + intensity * 0.3})`,
        textShadow: `
          0 0 ${3 + intensity * 8}px rgba(61,255,184,${0.2 + intensity * 0.3}),
          0 0 1px ${textColor === '#FFFFFF' ? 'rgba(255,255,255,0.4)' : 'rgba(21, 92, 68, 0.4)'}
          ${hasWhiteOutline ? ", 0.3px 0.3px 0px rgba(255,255,255,0.4)" : ""}
        `
      }}
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 25,
        delay: index * 0.02 // Only stagger characters within the already-delayed parent
      }}
      className="inline-block whitespace-pre"
    >
      {char}
    </motion.span>
  );
}
