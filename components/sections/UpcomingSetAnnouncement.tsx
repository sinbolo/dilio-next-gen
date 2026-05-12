"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { X, MapPin, Calendar, Radio, Copy, Mail, Check, CalendarPlus } from "lucide-react";

export function UpcomingSetAnnouncement({ forceOpen, onOpenChange, suppressAutoOpen }: { forceOpen?: boolean, onOpenChange?: (open: boolean) => void, suppressAutoOpen?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [view, setView] = useState<"initial" | "options" | "copied">("initial");

  useEffect(() => {
    if (forceOpen) {
      setIsVisible(true);
      setHasShown(true);
      if (onOpenChange) onOpenChange(false); // Reset the trigger
    }
  }, [forceOpen, onOpenChange]);

  useEffect(() => {
    if (isVisible && onOpenChange) {
      // If manually closed or internally closed, we could notify parent if needed
    }
  }, [isVisible, onOpenChange]);

  const suppressRef = useRef(suppressAutoOpen);
  useEffect(() => {
    suppressRef.current = suppressAutoOpen;
  }, [suppressAutoOpen]);

  const sectionRef = useRef<HTMLDivElement>(null);

  const eventAddress = "https://maps.app.goo.gl/vzRPwSzFfowStQAx6";
  const eventDetails = {
    title: "DILIO - OJEANDO FESTIVAL",
    location: "Escenario Molino, Ojén, Málaga",
    mapsUrl: "https://maps.app.goo.gl/vzRPwSzFfowStQAx6",
    date: {
      es: "Sábado 27 Junio",
      en: "Saturday June 27"
    },
    time: "03:00 AM",
    isoStart: "20260627T030000",
    isoEnd: "20260627T043000"
  };

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setLang(prev => prev === "es" ? "en" : "es");
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasShown) {
            const timer = setTimeout(() => {
              // Re-check if it's still intersecting after 6 seconds
              if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const isStillInView = rect.top < window.innerHeight && rect.bottom > 0;
                
                const bookingSection = document.getElementById('section-6-contact');
                let isBookingInView = false;
                if (bookingSection) {
                  const bRect = bookingSection.getBoundingClientRect();
                  if (bRect.top < window.innerHeight * 0.8 && bRect.bottom > window.innerHeight * 0.2) {
                    isBookingInView = true;
                  }
                }

                if (isStillInView && !suppressRef.current && !isBookingInView) {
                  setIsVisible(true);
                  setHasShown(true);
                }
              }
            }, 6000);
            return () => clearTimeout(timer);
          }
        } else {
          // If the user leaves the section, we can hide it 
          // to ensure it doesn't stay visible in other sections
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasShown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(eventAddress);
    setView("copied");
    setTimeout(() => setView("options"), 2000);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`${eventDetails.title} Info`);
    const body = encodeURIComponent(
      lang === "es" 
        ? `Hola! Aquí tienes la info del próximo DJ set de Dilio:\n\nEvento: OJEANDO FESTIVAL\nFecha: ${eventDetails.date.es}\nHora: ${eventDetails.time} (Madrugada)\nLugar: ${eventDetails.location}\nUbicación: ${eventDetails.mapsUrl}\n\n¡Entrada Gratis!`
        : `Hi! Here is the info for Dilio's next DJ set:\n\nEvent: OJEANDO FESTIVAL\nDate: ${eventDetails.date.en}\nTime: ${eventDetails.time} (Early Morning)\nLocation: ${eventDetails.location}\nMaps: ${eventDetails.mapsUrl}\n\nFree Entry!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleGoogleCalendar = () => {
    const details = lang === "es" 
      ? `DJ Set de Dilio en Ojeando Festival. Entrada Gratis!\n\nUbicación: ${eventDetails.mapsUrl}`
      : `Dilio DJ Set at Ojeando Festival. Free Entry!\n\nLocation: ${eventDetails.mapsUrl}`;
    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(eventDetails.location)}&dates=${eventDetails.isoStart}/${eventDetails.isoEnd}`;
    window.open(gCalUrl, "_blank");
  };

  const handleAppleCalendar = () => {
    const description = lang === "es"
      ? `DJ Set de Dilio en Ojeando Festival. Entrada Gratis!\\n\\nUbicación: ${eventDetails.mapsUrl}`
      : `Dilio DJ Set at Ojeando Festival. Free Entry!\\n\\nLocation: ${eventDetails.mapsUrl}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${eventDetails.isoStart}`,
      `DTEND:${eventDetails.isoEnd}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${eventDetails.location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "dilio-event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div ref={sectionRef} className="absolute inset-0 pointer-events-none" />
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 py-12 md:p-8 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
              onClick={() => setIsVisible(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[92%] max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[85vh] md:max-h-[90vh] overflow-y-auto scale-95 md:scale-100"
            >
              <div className="absolute top-0 right-0 h-full w-8 md:w-16 bg-[#22c55e] flex items-center justify-center overflow-hidden">
                <motion.div 
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="whitespace-nowrap flex items-center gap-4 origin-center -rotate-90"
                >
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={lang}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-black text-[10px] md:text-xs font-black tracking-[0.4em] uppercase"
                    >
                      {lang === "es" ? "ENTRADA GRATUITA • ENTRADA GRATUITA" : "FREE ENTRY • FREE ENTRY • FREE ENTRY"}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-white/20 z-20 pointer-events-none"
              />

              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#22c55e]/10 blur-[100px] rounded-full" />

              <div className="relative z-10 p-4 md:p-12 pr-10 md:pr-24">
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Radio className="text-[#22c55e] animate-pulse" size={20} />
                      <div className="absolute inset-0 bg-[#22c55e]/50 blur-lg rounded-full animate-ping" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="group p-3 md:p-2 bg-white/10 md:bg-white/5 hover:bg-white/20 rounded-full transition-all duration-300"
                    title="Close"
                  >
                    <X size={24} className="text-white md:text-white/40 group-hover:text-white group-hover:rotate-90 transition-all" />
                  </button>
                </div>

                <div className="space-y-8">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.h3 
                        key={lang}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-[#22c55e] font-display text-[10px] md:text-xs tracking-[0.5em] font-bold mb-4 uppercase"
                      >
                        {lang === "es" ? "Próximo DJ Set" : "Next DJ Set"}
                      </motion.h3>
                    </AnimatePresence>
                    <motion.h2 
                      animate={{ 
                        opacity: [1, 0.8, 1, 0.9, 1],
                        textShadow: [
                          "0 0 0px rgba(34, 197, 94, 0)",
                          "0 0 10px rgba(34, 197, 94, 0.3)",
                          "0 0 0px rgba(34, 197, 94, 0)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="text-2xl md:display-md text-white tracking-tighter leading-none mb-2 uppercase"
                    >
                      OJEANDO <br /> FESTIVAL
                    </motion.h2>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 p-2 bg-white/5 rounded-lg border border-white/10">
                        <Calendar size={18} className="text-[#22c55e]" />
                      </div>
                      <div>
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={lang}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white/30 text-[9px] tracking-[0.3em] uppercase mb-1 font-mono"
                          >
                            {lang === "es" ? "Fecha y Hora" : "Date & Time"}
                          </motion.p>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={lang}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-white text-base font-bold tracking-tight uppercase"
                          >
                            {lang === "es" ? eventDetails.date.es : eventDetails.date.en} — {eventDetails.time}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 p-2 bg-white/5 rounded-lg border border-white/10">
                        <MapPin size={18} className="text-[#22c55e]" />
                      </div>
                      <div>
                        <AnimatePresence mode="wait">
                          <motion.p 
                            key={lang}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white/30 text-[9px] tracking-[0.3em] uppercase mb-1 font-mono"
                          >
                            {lang === "es" ? "Ubicación" : "Location"}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-white text-base font-bold tracking-tight uppercase">ESCENARIO MOLINO <br /> OJÉN, MÁLAGA</p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <button 
                      onClick={handleCopy}
                      className="py-4 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-2xl border border-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                    >
                      {view === "copied" ? (
                        <Check size={16} className="text-[#22c55e]" />
                      ) : (
                        <Copy size={16} className="text-white/40 group-hover:text-white" />
                      )}
                      <span className={view === "copied" ? "text-[#22c55e]" : ""}>
                        {lang === "es" ? "COPIAR MAPS" : "COPY MAPS"}
                      </span>
                    </button>
                    
                    <button 
                      onClick={handleGoogleCalendar}
                      className="py-4 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-2xl border border-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                    >
                      <CalendarPlus size={16} className="text-white/40 group-hover:text-white" />
                      GOOGLE CAL
                    </button>

                    <button 
                      onClick={handleAppleCalendar}
                      className="py-4 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-2xl border border-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                    >
                      <Calendar size={16} className="text-white/40 group-hover:text-white" />
                      APPLE CAL
                    </button>

                    <button 
                      onClick={handleEmail}
                      className="py-4 bg-white/5 hover:bg-white/10 text-white text-[9px] font-bold tracking-[0.2em] uppercase rounded-2xl border border-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                    >
                      <Mail size={16} className="text-white/40 group-hover:text-white" />
                      {lang === "es" ? "VÍA EMAIL" : "VIA EMAIL"}
                    </button>
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/assets/noise.png')] bg-repeat" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
