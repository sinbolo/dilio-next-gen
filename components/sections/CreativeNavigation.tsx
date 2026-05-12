"use client";

import { MenuTutorial } from "../ui/MenuTutorial";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export function CreativeNavigation() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const folders = [
    { 
      label: "Músic", 
      top: isMobile ? "20%" : "28%", 
      left: isMobile ? "28%" : "22%", 
      icon: "/assets/boton-music-new.png", 
      link: "#section-music", 
      startX: isMobile ? -40 : -150, startY: isMobile ? -40 : -150 
    },
    { 
      label: "VIDEO", 
      top: isMobile ? "38%" : "58%", 
      left: isMobile ? "15%" : "18%", 
      icon: "/assets/boton video.png", 
      link: "#section-video", 
      startX: isMobile ? -40 : -150, startY: isMobile ? 40 : 150 
    },
    { 
      label: "TOUR", 
      top: isMobile ? "25%" : "20%", 
      right: isMobile ? "26%" : "28%", 
      icon: "/assets/boton tou.png", 
      link: "#section-tour", 
      startX: isMobile ? 40 : 150, startY: isMobile ? -40 : -150 
    },
    { 
      label: "BIO", 
      top: isMobile ? "42%" : "48%", 
      left: isMobile ? "71%" : undefined,
      right: isMobile ? undefined : "22%", 
      icon: "/assets/boton bio.png", 
      link: "#section-bio", 
      startX: isMobile ? 40 : 150, startY: 0 
    },
    { 
      label: "REDES", 
      top: isMobile ? "56%" : "75%", 
      right: isMobile ? "25%" : "35%", 
      icon: "/assets/boton-redes-new.png", 
      link: "#section-social", 
      startX: isMobile ? 40 : 150, startY: isMobile ? 40 : 150 
    },
    { 
      label: "MERCH", 
      top: isMobile ? "52%" : "72%", 
      left: isMobile ? "28%" : "35%", 
      icon: "/assets/boton merch.png", 
      link: "#section-merch", 
      startX: isMobile ? -40 : -150, startY: isMobile ? 40 : 150 
    },
  ];

  return (
    <section id="section-2-creative" className="min-h-0 h-[80dvh] md:h-[100dvh] relative w-full overflow-hidden bg-black flex items-center justify-center">
      <MenuTutorial />
      {/* Full-Screen Outpainted Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/fondo-page-2-full.png"
          alt="Creative Background"
          fill
          className="object-cover object-[center_25%] opacity-90 blur-[2px] scale-[1.02]"
          loading="lazy"
          quality={90}
        />
        {/* Cinematic vignette overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Floating Folders (Glassmorphism) */}
      <div className="relative z-10 w-full h-screen max-w-[1400px] mx-auto">
        {folders.map((folder, index) => (
          <motion.div
            key={index}
            initial={{ 
              x: folder.startX, 
              y: folder.startY, 
              opacity: 0,
              scale: 0.9
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 1.8,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              position: "absolute",
              top: folder.top,
              left: (folder as any).left,
              right: (folder as any).right,
              willChange: "transform, opacity",
              transform: "translate3d(0,0,0)"
            }}
          >
            <motion.a
              href={folder.link}
              animate={{ y: [0, -10, 0] }} // Reduced amplitude for more stability
              transition={{
                duration: 4 + (index % 3), // Slower, more elegant floating
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2 + index * 0.4,
              }}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-[50px] h-[50px] md:w-[130px] md:h-[130px] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 relative">
                <img 
                  src={folder.icon} 
                  alt={folder.label} 
                  className="w-full h-full object-contain filter drop-shadow-md" 
                  style={{ 
                    willChange: 'transform',
                    transform: folder.label === "REDES" ? "scale(0.85)" : "scale(1)"
                  }}
                />
              </div>
              
              {/* Text label */}
              <span className="label-xs text-white tracking-[0.2em] font-bold filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                {folder.label}
              </span>
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
