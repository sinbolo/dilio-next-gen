"use client";

import { useRef, useState, useEffect } from "react";
import { ScrollVideo } from "@/components/sections/ScrollVideo";
import { motion, useScroll, useTransform } from "framer-motion";
import { ContactForm } from "@/components/ui/ContactForm";
import { BookingWidget } from "@/components/ui/BookingWidget";
import { CreativeNavigation } from "@/components/sections/CreativeNavigation";
import { BioSection } from "@/components/sections/BioSection";
import { CustomAudioPlayer } from "@/components/sections/CustomAudioPlayer";
import { VideoGrid } from "@/components/sections/VideoGrid";
import { MerchGallery } from "@/components/sections/MerchGallery";
import { TourSection } from "@/components/sections/TourSection";
import { SmartSection } from "@/components/ui/SmartSection";
import { PremiumBookingTitle } from "@/components/ui/PremiumBookingTitle";
import { HeroTutorial } from "@/components/ui/HeroTutorial";
import { WorldScroll } from "@/components/ui/WorldScroll";
import { BookingTutorial } from "@/components/ui/BookingTutorial";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const { scrollYProgress: globalScroll } = useScroll();
  
  // Opacity transforms for text layers - Local to hero section (200vh)
  const textOpacity1 = useTransform(heroScroll, [0, 0.1, 0.2], [1, 1, 0]);
  const textOpacity3 = useTransform(heroScroll, [0.8, 0.9, 0.98], [0, 1, 0]);

  // Mobile detection for adjusted scroll ranges
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Intelligent Scroll Restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // If no specific section in URL, always start at the top
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    } else {
      // If there IS a hash, let it settle for a moment then scroll to it
      setTimeout(() => {
        const id = window.location.hash.slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
      }, 500);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Premium Transform for "HOUSE MÚSIC" - Color & Movement
  const textOpacity2 = useTransform(
    globalScroll, 
    isMobile ? [0.18, 0.22, 0.23, 0.26] : [0.18, 0.22, 0.30, 0.35], 
    [0, 1, 1, 0]
  );
  const textY2 = useTransform(globalScroll, [0.18, 0.35], [0, 100]);
  const textBlur2 = useTransform(
    globalScroll, 
    isMobile ? [0.23, 0.26] : [0.30, 0.35], 
    [0, 15]
  );
  const textColor2 = useTransform(globalScroll, [0.20, 0.30], ["#ffffff", "#10b981"]);
  const textGlow2 = useTransform(globalScroll, [0.20, 0.30], ["0 0 0px transparent", "0 0 20px rgba(16, 185, 129, 0.4)"]);

  return (
    <main className="bg-transparent">
      <HeroTutorial />
      <BookingWidget />

      {/* Hero Section with ScrollVideo */}
      <section 
        id="section-1-hero" 
        ref={heroRef}
        className="relative bg-[#ebebeb]"
      >
        <ScrollVideo totalFrames={329} />
        
        {/* Cinematic Text Overlays */}
        <div className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-12 md:p-20">
          <motion.div 
            style={{ 
              opacity: textOpacity2, 
              y: textY2,
              color: textColor2,
              textShadow: textGlow2,
              filter: useTransform(textBlur2, (v) => `blur(${v}px)`)
            }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="display-md mb-2">HOUSE MÚSIC</h2>
          </motion.div>

          <motion.div 
            style={{ opacity: textOpacity3 }}
            className="absolute bottom-12 md:bottom-20 flex justify-center w-full"
          >
            <span className="label-xs tracking-[0.3em] text-center max-w-md">
              SOUND & ART
            </span>
          </motion.div>
        </div>
      </section>

      {/* Section 2 - Creative Navigation */}
      <SmartSection id="section-2-creative" minHeight="100vh">
        <CreativeNavigation />
      </SmartSection>

      {/* Section 'Bio' */}
      <SmartSection id="section-bio" minHeight="800px">
        <BioSection />
      </SmartSection>

      {/* Section 3 - Music Player (Rule 3.A: Persistent) */}
      <SmartSection id="section-music" minHeight="800px" isPersistent={true}>
        <CustomAudioPlayer />
      </SmartSection>

      {/* Section 4 - Video Grid (Rule 3.A: Persistent for PiP) */}
      <SmartSection id="section-video" minHeight="1000px" isPersistent={true}>
        <VideoGrid />
      </SmartSection>

      {/* Section 5 - Merch Gallery */}
      <SmartSection id="section-merch" minHeight="1000px">
        <MerchGallery />
      </SmartSection>

      {/* Section 6 - Contact */}
      <SmartSection id="section-6-contact" minHeight="800px" className="bg-white py-[120px] isolate z-0">
        <div className="max-w-[1400px] w-full mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="flex flex-col items-center md:items-start gap-8">
              <PremiumBookingTitle text="BOOKING" />
              <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] ml-0 md:ml-4">
                <WorldScroll className="relative w-full h-full rounded-full overflow-hidden" />
              </div>
            </div>
            <div className="relative">
              <BookingTutorial />
              <ContactForm />
            </div>
        </div>
      </SmartSection>

      {/* Section 7 - Tour */}
      <SmartSection id="section-tour" minHeight="800px">
        <TourSection />
      </SmartSection>
    </main>
  );
}
