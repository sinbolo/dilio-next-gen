"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MusicTutorial } from "../ui/MusicTutorial";
import { LCDDisplay } from "./player/LCDDisplay";
import { JogWheel } from "./player/JogWheel";

declare global {
  interface Window {
    SC: any;
  }
}

const TRACKS = {
  1: {
    url: "https://soundcloud.com/progress-in-trance/etbg-missing-vs-abel-ramos-amp-miss-melody-mashup",
    name: "MISSING (REMADE)",
    artist: "DILIO",
    bpm: "124.3",
    key: "Cm",
    color: "#00e5ff",
    artwork: "/assets/sunshine-times-cover.png"
  },
  2: {
    url: "https://soundcloud.com/kazjames/kaz-james-arizona-original-mix",
    name: "ARIZONA",
    artist: "KAZ JAMES",
    bpm: "126.0",
    key: "Am",
    color: "#ff3d00",
    artwork: "/assets/logo 3d estatico verde.png"
  }
};

export function CustomAudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeUsb, setActiveUsb] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0); 
  const [currentTime, setCurrentTime] = useState("00:00.000");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
    };
  }, []);

  const initWidget = useCallback(() => {
    if (iframeRef.current && window.SC) {
      widgetRef.current = window.SC.Widget(iframeRef.current);
      const widget = widgetRef.current;

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.getDuration((d: number) => setDuration(d));
      });

      widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true));
      widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      widget.bind(window.SC.Widget.Events.FINISH, () => setIsPlaying(false));
      
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (p: any) => {
        const ms = p.currentPosition;
        setProgress(ms);
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const millis = Math.floor((ms % 1000));
        setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`);
      });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (window.SC) {
      initWidget();
    } else {
      const interval = setInterval(() => {
        if (window.SC) {
          initWidget();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [mounted, initWidget]);

  const loadTrack = useCallback((id: number) => {
    setIsConnecting(id);
    setIsPlaying(false);
    widgetRef.current?.pause();

    setTimeout(() => {
      setActiveUsb(id);
      setIsConnecting(0);
      if (widgetRef.current && TRACKS[id as keyof typeof TRACKS]) {
        widgetRef.current.load(TRACKS[id as keyof typeof TRACKS].url, {
          auto_play: true,
          show_comments: false,
          show_user: false,
          show_reposts: false,
          show_teaser: false,
          visual: false
        });
      }
    }, 1500);
  }, []);

  const handleUsbClick = useCallback((id: number) => {
    if (activeUsb === id || isConnecting !== 0) return;
    loadTrack(id);
  }, [activeUsb, isConnecting, loadTrack]);

  const handlePlayClick = useCallback(() => {
    if (isConnecting) return;
    widgetRef.current?.play();
  }, [isConnecting]);

  const handleSeek = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTimeMs = percentage * duration;
    widgetRef.current?.seekTo(newTimeMs);
    setProgress(newTimeMs);
  }, [duration]);

  const handleCue = useCallback(() => {
    if (isConnecting) return;
    widgetRef.current?.pause();
    widgetRef.current?.seekTo(0);
    setIsPlaying(false);
  }, [isConnecting]);

  const handlePlayPause = useCallback(() => {
    if (isConnecting) return;
    if (isPlaying) {
      widgetRef.current?.pause();
    } else {
      widgetRef.current?.play();
    }
  }, [isConnecting, isPlaying]);

  if (!mounted) return null;

  return (
    <section ref={sectionRef} id="section-music" className="w-full bg-white py-24">
      <div className="relative w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center">
        <div className="relative w-[180vw] md:w-full left-1/2 md:left-auto ml-[-90vw] md:ml-0 aspect-[16/9] max-h-[800px] bg-white overflow-visible flex items-center justify-center">
          <div className="relative w-full h-full">
        
          <Image
            src="/assets/reproductor-web.png"
            alt="CDJ-3000 Hardware"
            fill
            className="object-contain p-[1.71%] md:p-6"
            priority
          />

          <LCDDisplay 
            activeUsb={activeUsb}
            isConnecting={isConnecting}
            isPlaying={isPlaying}
            currentTime={currentTime}
            progress={progress}
            duration={duration}
            trackInfo={TRACKS[activeUsb as keyof typeof TRACKS]}
            isMobile={isMobile}
            isInView={isInView}
            onSeek={handleSeek}
            onPlayClick={handlePlayClick}
          />

          <div className="absolute top-[25%] md:left-[16.5%] left-[23.5%] w-[10%] h-[30%] flex flex-col gap-[15%] z-[100] scale-[0.65] md:scale-100 origin-left">
            <div className="relative h-[45%] flex items-center justify-center">
              <motion.div
                onClick={() => handleUsbClick(1)}
                className={`cursor-pointer transition-all duration-300 ${activeUsb === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'} ${isMobile ? 'scale-[1.3]' : ''}`}
                style={{ rotate: -15, x: '-10%' }}
              >
                <Image src="/assets/usb-1-custom.png" alt="USB 1" width={100} height={200} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              </motion.div>
            </div>
            <div className="relative h-[45%] flex items-center justify-center">
              <motion.div
                onClick={() => handleUsbClick(2)}
                className={`cursor-pointer transition-all duration-300 ${activeUsb === 2 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
                style={{ rotate: 12, x: '15%' }}
              >
                <Image src="/assets/usb-2-custom.png" alt="USB 2" width={100} height={200} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              </motion.div>
            </div>
          </div>

          <div 
            onClick={handleCue}
            className="absolute bottom-[13.5%] left-[32.65%] w-[4.0%] aspect-square rounded-full cursor-pointer z-[300] border border-white/5 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          >
            <AnimatePresence>
              {!isPlaying && !isConnecting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[#ffb300] shadow-[0_0_40px_rgba(255,179,0,0.8),0_0_15px_rgba(255,179,0,0.6),inset_0_0_15px_rgba(255,179,0,0.6)] bg-transparent"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
          </div>

          <div 
            onClick={handlePlayPause}
            className="absolute bottom-[4.6%] left-[32.65%] w-[4.0%] aspect-square rounded-full cursor-pointer z-[300] border border-white/5 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          >
            <AnimatePresence>
              {isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-[#4ade80] shadow-[0_0_40px_rgba(74,222,128,0.8),0_0_15px_rgba(74,222,128,0.6),inset_0_0_15px_rgba(74,222,128,0.6)] bg-transparent"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
          </div>

          <JogWheel isPlaying={isPlaying} activeUsb={activeUsb} />

          <div onClick={() => loadTrack(activeUsb === 1 ? 2 : 1)} className="absolute bottom-[31.5%] left-[28.5%] w-[3.5%] h-[3.5%] rounded-md cursor-pointer z-[100] hover:bg-white/5" />
          <div onClick={() => loadTrack(activeUsb === 1 ? 2 : 1)} className="absolute bottom-[31.5%] left-[25.8%] w-[3.5%] h-[3.5%] rounded-md cursor-pointer z-[100] hover:bg-white/5" />

          <AnimatePresence>
            {isConnecting !== 0 && (
              <motion.div
                key={`connecting-${isConnecting}`}
                initial={{ x: "-45%", y: isConnecting === 2 ? "-5%" : "-15%", scale: 0.04, opacity: 0, rotateZ: isConnecting === 2 ? 12 : -15 }}
                animate={{ 
                  x: ["-45%", "-35%", isConnecting === 2 ? (isMobile ? "-31%" : "-22.2%") : (isMobile ? "-32.5%" : "-22.8%")], 
                  y: [isConnecting === 2 ? "-5%" : "-15%", "-20%", isMobile ? "-25%" : "-15%"], 
                  scale: [0.04, 0.08, 0.065], 
                  rotateZ: [isConnecting === 2 ? 12 : -15, 20, 0],
                  opacity: [0, 1, 1]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute z-[150] pointer-events-none"
                style={{ width: '100%', height: '100%' }}
              >
                <Image src={`/assets/usb-${isConnecting || 1}-plugged-custom.png`} alt="Plugging..." fill className="object-contain" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeUsb !== null && isConnecting === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="absolute z-[140] pointer-events-none"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  transform: `translateX(${activeUsb === 1 ? (isMobile ? "-32.5%" : "-22.8%") : (isMobile ? "-31%" : "-22.2%")}) translateY(${isMobile ? "-25%" : "-15%"}) scale(0.065)`
                }}
              >
                <Image src={`/assets/usb-${activeUsb}-plugged-custom.png`} alt="Connected" fill className="object-contain" />
                <div className="absolute top-[48%] left-[49.5%] w-14 h-14 bg-red-600 rounded-full shadow-[0_0_120px_#ff0000,0_0_60px_#ff0000] z-[160]" style={{ transform: 'translate(-50%, -50%)', animation: 'led-blink 0.8s infinite alternate' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <iframe
            ref={iframeRef}
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACKS[1].url)}&color=%234ade80&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
            className="opacity-0 pointer-events-none absolute w-px h-px"
            allow="autoplay"
          />

          </div>
        </div>

        <div className="mt-8 text-black/40 text-[10px] uppercase tracking-[0.4em] font-light">
          CDJ DILIO Performance Hardware Interface
        </div>
        <MusicTutorial />
      </div>

      <style>{`
        @keyframes led-blink {
          0% { opacity: 0.3; filter: brightness(1) drop-shadow(0 0 5px #ff0000); }
          100% { opacity: 1; filter: brightness(1.8) drop-shadow(0 0 25px #ff0000); }
        }
        @keyframes jog-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
