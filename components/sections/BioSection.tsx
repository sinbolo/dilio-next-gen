"use client";

import { useState } from "react";
import { Globe, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { ImageSequencePlayer } from "./ImageSequencePlayer";
import { BioTutorial } from "../ui/BioTutorial";

export function BioSection() {
  const [lang, setLang] = useState<"en" | "es">("es");

  const toggleLang = () => setLang(lang === "es" ? "en" : "es");

  const content = {
    es: {
      title: "DILIO",
      bio: [
        {
          text: (
            <>
              <span className="text-black font-bold">Alejandro Méndez</span>, Ojén (Málaga), DJ y productor especializado en música House y sus diversas vertientes.
            </>
          )
        },
        {
          text: (
            <>
              Su sonido se nutre de la influencia de figuras como <span className="text-black/80">Axwell</span>, <span className="text-black/80">Dirty South</span> y <span className="text-black/80">Fedde Le Grand</span>.
            </>
          )
        },
        {
          text: (
            <>
              Desde su debut a temprana edad en el <span className="italic border-b border-black/20">Festival Ojeando</span>, su trayectoria está por definirse; la música tiene el poder de cambiarlo todo de la noche a la mañana.
            </>
          )
        }
      ]
    },
    en: {
      title: "DILIO",
      bio: [
        {
          text: (
            <>
              <span className="text-black font-bold">Alejandro Méndez</span>, Ojén (Málaga), DJ and producer specializing in House music and its diverse styles.
            </>
          )
        },
        {
          text: (
            <>
              His sound is influenced by figures such as <span className="text-black/80">Axwell</span>, <span className="text-black/80">Dirty South</span>, and <span className="text-black/80">Fedde Le Grand</span>.
            </>
          )
        },
        {
          text: (
            <>
              Since his early debut at the <span className="italic border-b border-black/20">Ojeando Festival</span>, his career is just beginning; music has the power to change everything overnight.
            </>
          )
        }
      ]
    },
  };

  return (
    <section id="section-bio" className="min-h-0 md:min-h-screen relative flex items-start justify-center bg-white pt-0 pb-10 md:pb-40 overflow-hidden">
      <BioTutorial />
      {/* Background Subtle Gradient */}


      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-20 pt-20 relative z-10">
        
        {/* Text Content - Left Side */}
        <div className="flex-1 flex flex-col justify-center order-2 md:order-1">
          <div className="hidden md:flex items-center justify-between mb-12 pb-6 border-b border-black/5">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-black/10" />
              <span className="label-xs text-black/40 tracking-[0.4em] uppercase">Origin // Profile</span>
            </div>
          </div>

          <div className="relative -top-40 md:top-0 h-32 md:h-64 mb-0 flex items-center justify-start ml-10 md:ml-12 z-0">
            <div className="relative h-full">
              {/* Base Image (Off) - Visible when "On" logo is off */}
              <motion.img 
                src="/assets/logo_bio_off_clean.png"
                className="h-full w-auto object-contain mix-blend-multiply relative left-2 md:left-0"
                initial={{ opacity: 0 }}
                whileInView={{ 
                  opacity: [
                    1, 1, // 0, 0.02 (OFF)
                    0, 0, // 0.021, 0.03 (ON)
                    1, 1, // 0.031, 0.04 (OFF)
                    0, 0, // 0.041, 0.05 (ON)
                    0, 0, // 0.051, 0.06 (ON 0.3)
                    0, 0, // 0.061, 0.54 (ON 1)
                    1, 1, // 0.541, 0.55 (OFF)
                    0, 0, // 0.551, 0.57 (ON 0.5)
                    1, 1  // 0.571, 1 (OFF)
                  ]
                }}
                transition={{ 
                  duration: 8.5,
                  repeat: Infinity,
                  times: [
                    0, 0.02,
                    0.021, 0.03,
                    0.031, 0.04,
                    0.041, 0.05,
                    0.051, 0.06,
                    0.061, 0.54,
                    0.541, 0.55,
                    0.551, 0.57,
                    0.571, 1
                  ],
                  ease: "linear"
                }}
              />
              
              {/* Active Image (On) - Infinite Loop: 4s ON / ~3.5s OFF */}
              <motion.div 
                className="absolute inset-0"
                animate={{ 
                  opacity: [
                    0, 0,       // OFF
                    1, 1,       // ON
                    0, 0,       // OFF
                    1, 1,       // ON
                    0.3, 0.3,   // ON (0.3)
                    1, 1,       // ON (1)
                    0, 0,       // OFF
                    0.5, 0.5,   // ON (0.5)
                    0, 0        // OFF
                  ],
                  scale: [
                    1, 1,       // OFF
                    1.05, 1.05, // ON
                    1, 1,       // OFF
                    1.05, 1.05, // ON
                    1.03, 1.03, // ON (0.3)
                    1.05, 1.05, // ON (1)
                    1, 1,       // OFF
                    1.03, 1.03, // ON (0.5)
                    1, 1        // OFF
                  ],
                  x: [
                    0, 0,       // OFF
                    30, 30,     // ON
                    0, 0,       // OFF
                    30, 30,     // ON
                    27, 27,     // ON (0.3)
                    30, 30,     // ON (1)
                    0, 0,       // OFF
                    27, 27,     // ON (0.5)
                    0, 0        // OFF
                  ]
                }}
                transition={{ 
                  duration: 8.5,
                  repeat: Infinity,
                  times: [
                    0, 0.02,
                    0.021, 0.03,
                    0.031, 0.04,
                    0.041, 0.05,
                    0.051, 0.06,
                    0.061, 0.54,
                    0.541, 0.55,
                    0.551, 0.57,
                    0.571, 1
                  ],
                  ease: "linear"
                }}
              >
                <img 
                  src="/assets/logo_bio_on_white_led.png"
                  className="h-full w-auto object-contain mix-blend-multiply brightness-[1.15] contrast-[1.1]"
                  alt="Dilio Logo Active"
                />
              </motion.div>
            </div>
          </div>
          
          {/* i18n Toggle - Now below logo */}
          <div className="mb-10 -mt-40 md:-mt-12 relative z-20 flex justify-center md:justify-start md:ml-12">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 px-4 py-1.5 bg-black/5 border border-black/5 rounded-full hover:bg-black/10 transition-all group relative overflow-hidden isolate"
              style={{ transform: 'translateZ(0)', clipPath: 'inset(0 round 9999px)' }}
            >
              {/* Background Glow - More Intense */}
              <motion.div 
                animate={{
                  background: lang === 'es' 
                    ? 'linear-gradient(90deg, rgba(255, 0, 0, 0.5) 0%, rgba(255, 200, 0, 0.7) 50%, rgba(255, 0, 0, 0.5) 100%)'
                    : 'linear-gradient(90deg, rgba(0, 80, 255, 0.5) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 0, 0, 0.5) 100%)'
                }}
                className="absolute inset-0 opacity-100 blur-md rounded-full"
              />
              
              <div className="relative flex items-center gap-2 z-10">
                <div className="relative">
                  <motion.div 
                    animate={{
                      background: lang === 'es'
                        ? 'radial-gradient(circle, rgba(255, 255, 0, 1) 0%, rgba(255, 0, 0, 1) 70%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(0, 50, 255, 1) 70%, transparent 100%)',
                      opacity: [0.8, 1, 0.8],
                      scale: [1.2, 1.5, 1.2]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-[-6px] blur-[6px] rounded-full"
                  />
                  <Globe size={12} className="relative z-10 text-white mix-blend-difference" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-white mix-blend-difference">{lang.toUpperCase()}</span>
              </div>
            </button>
          </div>
          
          <div className="space-y-6 relative -top-5 md:top-0 z-20 ml-4 md:ml-24">
            {content[lang].bio.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col gap-2"
              >
                <p className="body-md !text-xs md:!text-sm leading-relaxed text-black/60 font-light">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 md:ml-48 flex justify-center md:justify-start"
          >
            <a href="#section-music" className="group flex flex-col items-center md:items-start gap-6 text-[10px] text-black/50 uppercase tracking-[0.4em] hover:text-black transition-all">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span>Scroll</span>
                <span className="text-[8px] opacity-40">to</span>
                <span>explore</span>
              </div>
              <ArrowDown size={14} className="group-hover:translate-y-2 transition-transform" />
            </a>
          </motion.div>
        </div>

        <div className="flex-1 flex items-center justify-end md:justify-center relative order-1 md:order-2 w-full pt-0 pr-10 md:pr-0 md:pt-56 md:-ml-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.65 }}
            whileInView={{ opacity: 1, scale: 0.7 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[40%] md:w-full p-0 group"
            style={{ perspective: "3000px" }}
          >
            <div className="w-full h-full relative flex items-center justify-center overflow-visible">
               <ImageSequencePlayer 
                 frameCount={308}
                 basePath="/images/sections/bio/foto loop bio/frame_" 
                 extension=".webp"
                 fps={30}
                 className="w-full h-full mix-blend-multiply"
               />

               <div className="hidden md:flex absolute bottom-4 left-4 z-40 items-center gap-5 mix-blend-difference pointer-events-none opacity-40">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-white/50 tracking-[0.5em] uppercase mb-1 font-bold">DILIO</span>
                  </div>
               </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
