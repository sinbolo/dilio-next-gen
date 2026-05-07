"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { NotifyBanner } from "@/components/ui/NotifyBanner";
import { UpcomingSetAnnouncement } from "./UpcomingSetAnnouncement";

export function TourSection() {
  const tourDates = [
    { 
      city: "SWEDEN", 
      venue: "THE SESSIONS ARE COMING", 
      flagUrl: "/assets/flags/sweden.png"
    },
    { 
      city: "NORWAY", 
      venue: "THE EXPERIENCE IS COMING", 
      flagUrl: "/assets/flags/norway.png"
    },
    { 
      city: "BELGIUM", 
      venue: "A NEW ERA IS COMING", 
      flagUrl: "/assets/flags/belgium.png"
    },
    { 
      city: "IBIZA", 
      venue: "IS COMING", 
      flagUrl: "/assets/flags/ibiza.png"
    }
  ];

  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isManualAnnouncementOpen, setIsManualAnnouncementOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(sectionRef, { amount: 0.6 });
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [hasPassedHero, setHasPassedHero] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasPassedHero(latest > 800);
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Hide when near the bottom (redes/footer section)
      const threshold = isMobile ? 300 : 800;
      if (scrolled + viewportHeight > fullHeight - threshold) {
        setIsNearBottom(true);
      } else {
        setIsNearBottom(false);
      }
    };
    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleNotifyMe = (city: string) => {
    setSelectedCity(city);
    setIsNotifyOpen(true);
  };

  const handleShowAnnouncement = () => {
    setIsHelpOpen(false);
    setIsManualAnnouncementOpen(true);
  };

  return (
    <section id="section-tour" ref={sectionRef} className="relative min-h-screen w-full bg-white overflow-hidden flex flex-col justify-center py-12 md:py-[120px]">
      {/* Help Button - Now conditionally visible based on section view and scroll position */}
      <AnimatePresence>
        {isInView && hasPassedHero && (
          <div className={`fixed ${isMobile ? 'bottom-24 left-6' : 'bottom-12 left-12'} z-[1000] flex flex-col items-start gap-2`}>
            <motion.button
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              onClick={() => setIsHelpOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-4 group pointer-events-auto"
            >
              <div className={`w-10 h-10 md:w-10 md:h-10 rounded-full border ${isMobile ? 'border-black/30 bg-white/80 backdrop-blur-md shadow-lg' : 'border-black/20 bg-white/40 backdrop-blur-sm'} flex items-center justify-center text-[12px] md:text-[14px] font-bold text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-sm`}>
                ?
              </div>
              <span className={`text-[12px] md:text-[11px] tracking-[0.4em] text-black font-bold group-hover:text-black transition-colors uppercase`}>Help</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Tour Help Popup */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/20 backdrop-blur-xl pointer-events-auto"
              onClick={() => setIsHelpOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white p-12 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-black/5 pointer-events-auto text-center"
            >
              <div className="w-12 h-[1px] bg-black/10 mx-auto mb-8" />
              <p className="text-black/60 text-sm leading-relaxed tracking-wide mb-8">
                <span className="text-[10px] opacity-60 uppercase font-bold italic">Si no has visto el anuncio de la próxima fecha, puedes activarlo aquí:</span>
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="px-8 py-3 border border-black/10 text-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black/5 transition-all rounded-full"
                >
                  Entendido
                </button>
                <button 
                  onClick={handleShowAnnouncement}
                  className="px-8 py-3 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black/80 transition-all rounded-full"
                >
                  Ver Próxima Fecha
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notify Banner Component */}
      <NotifyBanner 
        isOpen={isNotifyOpen} 
        onClose={() => setIsNotifyOpen(false)} 
        city={selectedCity} 
      />

      {/* Creative Surprise Announcement */}
      <UpcomingSetAnnouncement 
        forceOpen={isManualAnnouncementOpen} 
        onOpenChange={setIsManualAnnouncementOpen} 
      />

      {/* Responsive Immersive Background */}
      <div className="absolute inset-0 z-0">
        {/* Mobile Asset: Ultra-Minimalist with vast white space */}
        <div className="md:hidden absolute inset-0">
          <Image
            src="/assets/dilio-tour-mobile-ultra.png"
            alt="Dilio Tour Mobile Ultra"
            fill
            quality={100}
            unoptimized={true}
            className="object-cover object-center opacity-80 blur-[0.5px] scale-[2.0] brightness-[1.05] contrast-[1.01]"
          />
        </div>
        {/* Desktop Asset */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/assets/dilio-tour-full.png"
            alt="Dilio Tour Desktop"
            fill
            quality={100}
            unoptimized={true}
            className="object-cover object-center opacity-80 blur-[3px] scale-[0.5] brightness-[1.05] contrast-[1.01]"
          />
        </div>
        {/* Subtle vignette for typography focus */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-start pt-16 md:pt-0">
        
        {/* Monolithic Title */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-24"
        >
          <div className="relative inline-block">
            <h1 className="display-lg text-black text-3xl md:text-8xl lg:text-[120px] font-bold leading-none tracking-tighter relative">
              TOUR
              
              {/* Premium Gliding Airplane Animation */}
              <motion.div
                animate={{
                  x: [-200, 200],
                  y: [-150, 150],
                  rotate: [0, 0],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.1, 0.8]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute pointer-events-none z-30 w-[60px] md:w-[120px] h-[60px] md:h-[120px]"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                  {/* Realistic Contrail (Estela) */}
                  <motion.div
                    animate={{ 
                      width: [0, 300, 450],
                      opacity: [0, 0.4, 0],
                      x: [-150, -250, -400],
                      y: [-100, -180, -250]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute top-[20%] left-0 h-[2px] md:h-[4px] bg-gradient-to-r from-white via-white/40 to-transparent blur-[2px] md:blur-[4px] origin-right"
                    style={{ transform: 'rotate(155deg)' }} // Matches the top-left to bottom-right path
                  />

                  {/* Airplane Image */}
                  <div className="relative w-full h-full z-20">
                    <Image 
                      src="/assets/boton tou.png" 
                      alt="Airplane" 
                      width={120} 
                      height={120} 
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
                    />
                  
                  {/* Realistic Navigation Lights - Higher and More Diffused */}
                  <motion.div 
                    animate={{ opacity: [0, 1, 0.4, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[35%] left-[25%] w-1.5 h-1.5 bg-red-500/80 rounded-full shadow-[0_0_15px_#ef4444,0_0_30px_rgba(239,68,68,0.5)] blur-[1px]"
                  />
                  <motion.div 
                    animate={{ opacity: [0, 0.8, 0.2, 0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[38%] right-[28%] w-1.5 h-1.5 bg-white/80 rounded-full shadow-[0_0_18px_#ffffff,0_0_35px_rgba(255,255,255,0.4)] blur-[1.5px]"
                  />
                </div>
              </motion.div>
            </h1>

            {/* Professional 3D Cloud Clusters */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  x: i % 2 === 0 ? [-100, 100] : [100, -100], 
                  y: [0, -20, 0],
                  opacity: [0, 0.6, 0.6, 0],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 10 + i * 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 3
                }}
                className="absolute z-10 pointer-events-none"
                style={{ 
                  width: '300px', 
                  height: '150px',
                  top: `${-40 + i * 30}%`,
                  left: `${-20 + i * 25}%`
                }}
              >
                {/* Stylized Illustrative Cloud Construction - High Visibility Drawing Style */}
                <div className="relative w-full h-full flex items-center justify-center scale-90">
                  {/* Layered defined circles for an illustrative look */}
                  <div className="absolute w-[60%] h-[70%] bg-sky-200/80 border border-sky-400/40 blur-[10px] rounded-full left-0 bottom-0" />
                  <div className="absolute w-[65%] h-[80%] bg-white border border-sky-300/50 blur-[5px] rounded-full left-[20%] top-0 shadow-xl" />
                  <div className="absolute w-[50%] h-[60%] bg-slate-200/80 border border-slate-400/40 blur-[8px] rounded-full right-0 bottom-[10%]" />
                  
                  {/* Cartoon-style highlights */}
                  <div className="absolute top-[15%] left-[25%] w-[35%] h-[25%] bg-white blur-[3px] rounded-full opacity-90" />
                  
                  {/* Stronger illustrative glow silhouette */}
                  <div className="absolute inset-0 border-[1px] border-sky-400/30 blur-[4px] rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-[8px] md:text-lg text-black/40 tracking-[0.5em] uppercase mt-2 md:mt-6">Global Sessions</p>
        </motion.div>

        {/* Tour Dates List */}
        <div className="w-full flex flex-col gap-5 md:gap-12">
          {tourDates.map((tour, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, borderBottomColor: "rgba(0,0,0,0)" }}
              whileInView={{ opacity: 1, borderBottomColor: "rgba(0,0,0,0.1)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row md:items-end justify-between border-b-[1px] border-black/10 pb-3 md:pb-8 hover:border-black transition-colors duration-500"
            >
              
              <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-16">
                {/* Creative SOON Status */}
                <div className="min-w-[80px]">
                  <motion.span 
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[#22c55e] font-display text-[9px] md:text-lg tracking-[0.3em] font-bold"
                  >
                    SOON
                  </motion.span>
                </div>
                
                <div className="flex flex-col">
                  {/* Typographic Flag Revelation (Mask Reveal) */}
                  <div className="relative">
                    <h2 className="display-md text-black text-xl md:text-5xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wider">
                      <motion.span
                        className="relative inline-block px-2 transition-all duration-700 ease-out"
                        style={{ 
                          backgroundClip: "text", 
                          WebkitBackgroundClip: "text", 
                          backgroundSize: "110% 110%", 
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat"
                        }}
                        whileHover={{
                          backgroundImage: `url('${tour.flagUrl}')`,
                          color: "transparent",
                          scale: 1.05,
                          opacity: [1, 0.5, 1, 0.8, 1],
                          transition: { 
                            backgroundImage: { duration: 0.3 },
                            opacity: { duration: 0.2, repeat: Infinity },
                            scale: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
                          }
                        }}
                      >
                        {tour.city}
                      </motion.span>
                    </h2>
                  </div>
                  <span className="text-[8px] md:text-xs text-black/40 tracking-[0.2em] uppercase mt-0 md:mt-2 font-mono font-medium">{tour.venue}</span>
                </div>
              </div>

              <div className="mt-3 md:mt-0">
                <button 
                  onClick={() => handleNotifyMe(tour.city)}
                  className="w-full md:w-auto px-5 py-2 md:py-4 bg-transparent border border-black/10 text-black/30 text-[8px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300"
                >
                  NOTIFY ME
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
