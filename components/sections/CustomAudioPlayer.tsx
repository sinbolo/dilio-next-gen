"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    SC: any;
  }
}

// --- Configuration & Constants ---
const TRACKS = {
  1: {
    url: "https://soundcloud.com/progress-in-trance/etbg-missing-vs-abel-ramos-amp-miss-melody-mashup",
    name: "MISSING (REMADE)",
    artist: "DILIO",
    bpm: "124.3",
    key: "Cm",
    color: "#00e5ff", // Cyan for first track
    artwork: "/assets/sunshine-times-cover.png"
  },
  2: {
    url: "https://soundcloud.com/kazjames/kaz-james-arizona-original-mix",
    name: "ARIZONA",
    artist: "KAZ JAMES",
    bpm: "126.0",
    key: "Am",
    color: "#ff3d00", // Orange for second track
    artwork: "/assets/logo 3d estatico verde.png"
  }
};

import { MusicTutorial } from "../ui/MusicTutorial";

export function CustomAudioPlayer() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeUsb, setActiveUsb] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(0); // 0: none, 1: usb1, 2: usb2
  const [currentTime, setCurrentTime] = useState("00:00.000");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isReady, setIsReady] = useState(false);

  // Sync mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const userWantsToPlay = useRef(false);

  // SoundCloud Widget Logic
  useEffect(() => {
    if (!mounted) return;

    let initInterval: NodeJS.Timeout;
    
    const initWidget = () => {
      if (iframeRef.current && window.SC) {
        clearInterval(initInterval);
        widgetRef.current = window.SC.Widget(iframeRef.current);
        const widget = widgetRef.current;

        widget.bind(window.SC.Widget.Events.READY, () => {
          console.log("SoundCloud Widget Ready");
          setIsReady(true);
          widget.getDuration((d: number) => setDuration(d));
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
        });
        
        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          if (userWantsToPlay.current) {
            // Unexpected pause (lag, buffering, or mobile block)
            // Retry playing to force the stream
            setTimeout(() => widget.play(), 200);
          } else {
            setIsPlaying(false);
          }
        });
        
        widget.bind(window.SC.Widget.Events.FINISH, () => {
          userWantsToPlay.current = false;
          setIsPlaying(false);
        });
        
        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (p: any) => {
          const ms = p.currentPosition;
          setProgress(ms);
          const minutes = Math.floor(ms / 60000);
          const seconds = Math.floor((ms % 60000) / 1000);
          const millis = Math.floor((ms % 1000));
          setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`);
        });
      }
    };

    // Try immediately
    initWidget();

    // If not ready, poll until it is
    if (!widgetRef.current) {
      initInterval = setInterval(initWidget, 500);
    }

    return () => {
      if (initInterval) clearInterval(initInterval);
      if (widgetRef.current) {
        try {
          widgetRef.current.unbind(window.SC.Widget.Events.READY);
          widgetRef.current.unbind(window.SC.Widget.Events.PLAY);
          widgetRef.current.unbind(window.SC.Widget.Events.PAUSE);
          widgetRef.current.unbind(window.SC.Widget.Events.FINISH);
          widgetRef.current.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
        } catch (e) {
          console.warn("SoundCloud widget unbind failed, likely due to iframe removal:", e);
        }
      }
    };
  }, [mounted]);

  const handleUsbClick = (id: number) => {
    if (activeUsb === id || isConnecting !== 0) return;
    loadTrack(id);
  };

  const loadTrack = (id: number) => {
    setIsConnecting(id);
    setIsPlaying(false);
    userWantsToPlay.current = false;
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
  };

  const handleNextTrack = () => {
    const nextId = activeUsb === 1 ? 2 : 1;
    loadTrack(nextId);
  };

  const handlePrevTrack = () => {
    const prevId = activeUsb === 1 ? 2 : 1;
    loadTrack(prevId);
  };

  // --- WAVEFORM CANVAS RENDERER ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const [isInView, setIsInView] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (playerRef.current) observer.observe(playerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInView) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;
      
      ctx.clearRect(0, 0, w, h);
      
      // Draw Waveform (Adaptive Density)
      const isMobile = window.innerWidth < 768;
      const barWidth = isMobile ? 3 : 2;
      const gap = isMobile ? 1.5 : 0.5; 
      const step = barWidth + gap;
      const count = Math.ceil(w / step);
      
      offsetRef.current += 2.4; 
      
      const startI = Math.floor(offsetRef.current / step);
      const pixelOffset = offsetRef.current % step;

      for (let i = 0; i < count + 2; i++) {
        const x = (i * step) - pixelOffset;
        const dataIndex = startI + i;

        // --- Hardware-Accurate Energy Modeling ---
        const kickInterval = 32;
        const kickPos = (dataIndex % kickInterval);
        const kickEnergy = Math.pow(Math.max(0, 1 - kickPos / 4), 2) * 50;
        
        const snarePos = (dataIndex + 16) % kickInterval;
        const snareEnergy = Math.pow(Math.max(0, 1 - snarePos / 6), 2) * 35;
        
        const hatPos = (dataIndex + 8) % 16;
        const hatEnergy = Math.pow(Math.max(0, 1 - hatPos / 3), 2) * 20;
        
        const bassline = Math.sin(dataIndex * 0.12) * 12 + 18;
        const noise = (Math.sin(dataIndex * 0.5) + 1) * 5;

        // Combine for CDJ-3000 RGB/3-Band Look (Ultra-Compact Scale)
        const scale = 0.35; // Ultra-compact scale
        const low = (kickEnergy + bassline) * scale;
        const mid = (snareEnergy + noise + 8) * scale;
        const high = (hatEnergy + 5) * scale;
        
        // Draw Symmetric Stack (Exact Image Colors)
        const drawStackedBar = (direction: number) => {
          // 1. Blue Core (Lows) - Solid & Wide
          ctx.fillStyle = '#0066ff'; 
          ctx.fillRect(x, centerY, barWidth, direction * (low + (2 * scale)));
          
          // 2. Amber Highlight (Mids)
          ctx.fillStyle = '#ffcc00'; 
          ctx.fillRect(x, centerY + (direction * low), barWidth, direction * mid);
          
          // 3. White Peak (Highs)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, centerY + (direction * (low + mid)), barWidth, direction * high);
        };

        drawStackedBar(-1);
        drawStackedBar(1);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  if (!mounted) return null;

  return (
    <section id="section-music" className="w-full bg-white py-24">
      <div ref={playerRef} className="relative w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center" style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}>
        {/* Seamless Container (Uniform with Bio section bg-white) */}
        <div className="relative w-[180vw] md:w-full left-1/2 md:left-auto ml-[-90vw] md:ml-0 aspect-[16/9] max-h-[800px] bg-white overflow-visible flex items-center justify-center">
          <div className="relative w-full h-full">
        
        {/* Hardware Base Image */}
        <Image
          src="/assets/reproductor-web.png"
          alt="CDJ-3000 Hardware"
          fill
          className="object-contain p-[1.71%] md:p-6"
          priority
        />

        {/* --- LCD SCREEN OVERLAY --- */}
        <div 
          onClick={() => {
            if (isConnecting || isPlaying || !isReady) return;
            userWantsToPlay.current = true;
            setIsPlaying(true);
            widgetRef.current?.play();
          }}
          className={`absolute top-[10.5%] left-[37.7%] w-[24.5%] h-[26.5%] ${isMobile ? '' : 'overflow-hidden'} rounded-[2px] cursor-pointer z-40 flex flex-col group bg-[#020406] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]`}
        >
          {/* Edge Softening (Realistic Vignette) */}
          <div className="absolute inset-0 pointer-events-none z-[100] shadow-[inset_0_0_25px_rgba(0,0,0,1)] opacity-70" />
          
          {/* CDJ-3000 UI Overlay - Tight Flush Layout */}
          <div className="relative h-full w-full flex flex-col font-sans select-none overflow-hidden">
            
            {/* --- TOP BAR --- */}
            <div className="h-[15%] w-full flex items-center justify-between px-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 opacity-60">
                  <svg className="w-3 h-3 fill-current text-white/80" viewBox="0 0 24 24">
                    <path d="M15 7v2h5v3h-2l-4 4v-2H9v2L5 12h2V9h5V7h3m1-2H11v2H7v2H4l-1 1v4l1 1h4v2h4v-2h4l1-1v-4l-1-1h-3V7h-4V5z" />
                  </svg>
                  <span className="text-[8px] font-bold text-white/80 uppercase tracking-tighter">USB {activeUsb}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 opacity-80 scale-90 origin-right">
                  <span className="text-[6px] text-white/40 font-bold uppercase tracking-tight">Quantize</span>
                  <div className="w-1 h-1 rounded-full bg-red-600 shadow-[0_0_3px_rgba(220,38,38,0.8)]" />
                </div>
              </div>
            </div>

            {/* --- MAIN DISPLAY --- */}
            <div className="flex-1 flex gap-3 px-3 py-1">
              {/* Left: Artwork & Info */}
              <div className="w-[18%] flex flex-col justify-between py-1">
                {/* Halftone Portrait Artwork - Dynamic Color Tint & Creative Load Animation */}
                <div className={`aspect-square w-[98%] mx-auto rounded overflow-hidden mb-2 shadow-lg relative transition-all duration-500 border ${
                  activeUsb === 1 ? 'bg-yellow-400 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10'
                }`}>
                  <motion.div
                    key={activeUsb} // Retrigger animation on USB change
                    initial={{ clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src="/assets/dilio-halftone.png" 
                      alt="Track Artwork"
                      fill
                      className={`object-cover transition-all duration-500 ${
                        activeUsb === 1 
                          ? 'opacity-100 grayscale contrast-[2] brightness-[0.8] mix-blend-multiply' 
                          : 'opacity-90 contrast-125 grayscale'
                      }`}
                      style={{ filter: activeUsb === 1 ? 'sepia(1) saturate(5)' : 'none' }}
                    />
                    {/* Glowing Scanning Line at the edge of the reveal */}
                    <motion.div 
                      initial={{ top: '100%' }}
                      animate={{ top: '0%' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-[1px] bg-white shadow-[0_0_8px_white] z-10"
                    />
                  </motion.div>

                  {/* Additional Glow Layer for USB 1 */}
                  {activeUsb === 1 && (
                    <div className="absolute inset-0 bg-yellow-400/30 mix-blend-overlay pointer-events-none" />
                  )}
                  {/* Subtle Scanline Overlay on Artwork */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_2px]" />
                </div>

                <div>
                  <div className={`text-[4px] md:text-[7px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1 ${isMobile ? 'translate-y-[16px]' : ''}`}>Track</div>
                  <div className="overflow-hidden w-full whitespace-nowrap">
                    <motion.div 
                      className="inline-block"
                      animate={{ 
                        x: ["0%", "-50%"]
                      }}
                      transition={{ 
                        duration: 10, 
                        repeat: Infinity, 
                        ease: "linear"
                      }}
                    >
                      <span className="text-[5px] md:text-[10px] font-black text-white leading-none uppercase tracking-tight pr-10">
                        {isConnecting ? "LOADING..." : TRACKS[activeUsb as keyof typeof TRACKS]?.name}
                      </span>
                      <span className="text-[5px] md:text-[10px] font-black text-white leading-none uppercase tracking-tight pr-10">
                        {isConnecting ? "LOADING..." : TRACKS[activeUsb as keyof typeof TRACKS]?.name}
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 md:w-5 md:h-5 bg-[#007aff] flex items-center justify-center rounded-sm text-[6px] md:text-[9px] font-black text-white flex-shrink-0">1</div>
                  <div>
                    <div className="text-[5px] md:text-[7px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1">Artist</div>
                    <div className="text-[7px] md:text-[10px] font-medium text-white/60 truncate leading-none uppercase">
                      {isConnecting ? "---" : TRACKS[activeUsb as keyof typeof TRACKS]?.artist}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Waveform Area */}
              <div className="flex-1 flex flex-col relative">
                {/* Scrolling Waveform Area (HD Canvas Replica) */}
                <div className="flex-1 relative mt-5 mb-5 overflow-hidden rounded bg-[#010204] border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
                  
                  {/* Hardware Scanline Texture Overlay */}
                  <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.05]" 
                    style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)', backgroundSize: '100% 4px' }} 
                  />

                  {/* Playhead (Red Line) */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#ff0000] z-30 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
                  
                  {/* Canvas Waveform */}
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Beat Grid Lines (Ultra-High Density) */}
                  <div className="absolute inset-0 pointer-events-none flex justify-between px-1 opacity-[0.06] z-10">
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div key={i} className="w-[1px] h-full bg-white/40" />
                    ))}
                  </div>
                </div>

                {/* --- NEW: Compact Time Display between waveforms --- */}
                <div className="flex items-center justify-center py-1 bg-black/40 border-y border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[9px] md:text-xl font-black text-white tabular-nums tracking-tight">
                      {currentTime.split('.')[0]}
                    </span>
                    <span className="text-[5px] md:text-xs font-bold text-white/60">
                      .{currentTime.split('.')[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Empty for absolute data positioning */}
              <div className="w-[18%] flex flex-col items-end justify-between py-1 pb-0 relative">
              </div>
            </div>

            {/* --- BOTTOM WAVEFORM OVERVIEW (Realistic Track Structure) - INTERACTIVE --- */}
            <div 
              className={`w-full bg-[#010204] px-3 py-1.5 overflow-hidden flex flex-col justify-center border-t border-white/10 cursor-pointer ${isMobile ? 'absolute bottom-0 left-0 right-0 h-[20%] z-[999]' : 'relative h-[20%] z-50'}`}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                const newTimeMs = percentage * duration;
                widgetRef.current?.seekTo(newTimeMs);
                setProgress(newTimeMs);
              }}
            >
              <div className={`flex items-center h-full gap-[0.5px] ${isMobile ? 'opacity-100' : 'opacity-40'}`}>
                {Array.from({ length: 200 }).map((_, i) => {
                  // Track Structure: Intro -> Drop 1 -> Breakdown -> Drop 2 -> Outro
                  let structureMultiplier = 0.3; // Intro/Outro
                  if ((i > 40 && i < 80) || (i > 120 && i < 170)) structureMultiplier = 1.0; // Drops
                  if (i >= 80 && i <= 120) structureMultiplier = 0.4; // Breakdown

                  const h = Math.max(15, (Math.abs(Math.sin(i * 0.1)) * 50 + Math.random() * 30) * structureMultiplier);
                  
                  return (
                    <div 
                      key={i}
                      className="flex-1"
                      style={{ 
                        height: `${h}%`,
                        background: `linear-gradient(to bottom, #0055ff 0%, #ffaa00 50%, #0055ff 100%)`
                      }}
                    />
                  );
                })}
              </div>
              {/* Progress Indicator (Playhead - Red/White) */}
              <div 
                className="absolute top-0 bottom-0 left-0 bg-white/10 border-r-[3px] border-[#ff0000] shadow-[0_0_20px_rgba(255,0,0,0.7)] transition-all duration-100"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>

            <div className={`absolute bottom-3 right-6 flex flex-col items-center pointer-events-none ${isMobile ? 'z-[1000] translate-y-[10px]' : 'z-[110]'}`}>
              {/* Scale Down Pitch & Master Tempo Cluster */}
              <div className="flex flex-col items-center mb-1 opacity-90 scale-[0.75] origin-bottom">
                <div className="text-[3.5px] md:text-[5px] font-black text-[#ff0000] uppercase tracking-tighter leading-none mb-0.5">MASTER TEMPO</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[3.5px] md:text-[5px] text-white/30 font-bold uppercase tracking-widest">PITCH</span>
                  <span className="text-[6px] md:text-[8px] font-bold text-[#4ade80] tabular-nums leading-none">+0.00%</span>
                </div>
              </div>

              <div className="border border-white/20 rounded-sm px-1 py-0.5 bg-black/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex flex-col items-center mb-1">
                <div className="text-[3px] md:text-[4px] text-white/30 font-bold uppercase tracking-widest leading-none mb-0.5">BPM</div>
                <div className="text-[10px] md:text-sm font-black text-white tabular-nums leading-none drop-shadow-[0_0:8px_rgba(255,255,255,0.5)]">
                  {isConnecting ? "---" : TRACKS[activeUsb as keyof typeof TRACKS]?.bpm}
                </div>
              </div>
              
              <div className="text-[5px] md:text-[7px] font-bold text-white/80 tracking-tighter uppercase tabular-nums">
                {TRACKS[activeUsb as keyof typeof TRACKS]?.key}
              </div>
            </div>

          </div>
        </div>

        {/* --- USB SELECTION MENU --- */}
        <div className="absolute top-[25%] md:left-[16.5%] left-[23.5%] w-[10%] h-[30%] flex flex-col gap-[15%] z-[100] scale-[0.65] md:scale-100 origin-left">
          <div className="relative h-[45%] flex items-center justify-center">
            <motion.div
              onClick={() => handleUsbClick(1)}
              className={`cursor-pointer transition-all duration-300 ${activeUsb === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'} ${isMobile ? 'scale-[1.3]' : ''}`}
              style={{ rotate: -15, x: '-10%' }}
            >
              <Image 
                src="/assets/usb-1-custom.png" 
                alt="USB 1" 
                width={100} 
                height={200} 
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
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

        {/* --- HARDWARE BUTTONS OVERLAYS --- */}
        
        {/* CUE Button Overlay - Physical Round Button Look */}
        <div 
          onClick={() => {
            if (isConnecting) return;
            userWantsToPlay.current = false;
            widgetRef.current?.pause();
            widgetRef.current?.seekTo(0);
            setIsPlaying(false);
          }}
          className="absolute bottom-[13.5%] left-[32.65%] w-[4.0%] aspect-square rounded-full cursor-pointer z-[200] border border-white/5 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          title="CUE"
        >
          {/* CUE Light (Amber) - Faster Blinking Animation */}
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
          {/* Physical Rim Effect */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
        </div>

        {/* PLAY/PAUSE Button Overlay - Physical Round Button Look */}
        <div 
          onClick={() => {
            if (isConnecting || !isReady) return;
            if (isPlaying) {
              userWantsToPlay.current = false;
              widgetRef.current?.pause();
              setIsPlaying(false);
            } else {
              userWantsToPlay.current = true;
              // Force immediate UI feedback to avoid "movement and stop" lag
              setIsPlaying(true);
              widgetRef.current?.play();
            }
          }}
          className="absolute bottom-[4.6%] left-[32.65%] w-[4.0%] aspect-square rounded-full cursor-pointer z-[200] border border-white/5 bg-black/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
          title="PLAY / PAUSE"
        >
          {/* PLAY Light (Green) - Faster Blinking Animation */}
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
          {/* Physical Rim Effect */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10 pointer-events-none" />
        </div>

        {/* --- JOG WHEEL DYNAMIC CENTER --- */}
        <div className="absolute top-[69.5%] left-[50.0%] w-[5.5%] md:w-[4.5%] aspect-square -translate-x-1/2 -translate-y-1/2 z-[90] pointer-events-none">
          {/* Jog Ring / Outer Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-white/5 bg-black/40 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Waiting for logo-jog-new.png to be saved in /public/assets/ */}

          </div>
          
          {/* --- NEW: Four Corner Green LEDs around the Jog --- */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-[-100%] rounded-full pointer-events-none -translate-y-[10%] -translate-x-[5%]"
              >
                {/* Subtle Containing Ring */}
                <div className="absolute inset-0 rounded-full border border-[#4ade80]/10 shadow-[inset_0_0_15px_rgba(74,222,128,0.05)]" />
                
                {[
                  { top: '0%', left: '0%' },   // TL
                  { top: '2%', left: '95%' },   // TR (Moved up and right)
                  { top: '100%', left: '0%' }, // BL
                  { top: '90%', left: '90%' }  // BR (Moved up and right)
                ].map((pos, i) => (
                  <motion.div 
                    key={`jog-led-${i}`}
                    animate={{ opacity: [0.1, 1, 0.1], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[20%] h-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ade80]/40 shadow-[0_0_15px_#4ade80,0_0_50px_rgba(74,222,128,0.6),0_0_100px_rgba(74,222,128,0.3)] z-[100] blur-[2px]"
                    style={pos}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Rotating Marker (Pioneer style) - Pauses where it is, resets on USB change */}
          <div 
            key={`jog-marker-${activeUsb}`}
            className="absolute inset-0 rounded-full"
            style={{ 
              animation: 'jog-rotate 1.8s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          >
            {/* The white "needle" marker - Bigger */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3%] h-[50%] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full" />
          </div>

          {/* Inner Shadow / Depth */}
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,1)] pointer-events-none" />
        </div>

        {/* TRACK SEARCH Buttons */}
        <div 
          onClick={handleNextTrack}
          className="absolute bottom-[31.5%] left-[28.5%] w-[3.5%] h-[3.5%] rounded-md cursor-pointer z-[100] hover:bg-white/5"
          title="Next Track"
        />
        <div 
          onClick={handlePrevTrack}
          className="absolute bottom-[31.5%] left-[25.8%] w-[3.5%] h-[3.5%] rounded-md cursor-pointer z-[100] hover:bg-white/5"
          title="Prev Track"
        />

        {/* --- CINEMATIC PLUG-IN ANIMATION --- */}
        <AnimatePresence>
          {isConnecting !== 0 && (
            <motion.div
              key={`connecting-${isConnecting}`}
              className="absolute z-[150] pointer-events-none flex items-center justify-center"
              style={{ 
                top: '35.00%',
                left: isConnecting === 1 ? '28.63%' : '29.48%',
                width: '6.5%', 
                aspectRatio: '16/9'
              }}
              initial={{ 
                x: '-700%', 
                y: isConnecting === 1 ? '-150%' : '110%', 
                scale: 0.61, 
                opacity: 0, 
                rotateZ: isConnecting === 1 ? -15 : 12 
              }}
              animate={{ 
                x: ['-700%', '-500%', '-50%'], 
                y: isConnecting === 1 ? ['-150%', '-280%', '-50%'] : ['110%', '-150%', '-50%'], 
                scale: [0.61, 1.23, 1], 
                rotateZ: isConnecting === 1 ? [-15, 20, 0] : [12, 20, 0],
                opacity: [0, 1, 1]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Image 
                src={`/assets/usb-${isConnecting || 1}-plugged-custom.png`} 
                alt="Plugging..." 
                fill 
                className="object-contain" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STATIC CONNECTED STATE --- */}
        <AnimatePresence>
          {activeUsb !== null && isConnecting === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="absolute z-[140] pointer-events-none flex items-center justify-center"
              style={{ 
                top: '35.00%',
                left: activeUsb === 1 ? '28.63%' : '29.48%',
                width: '6.5%', 
                aspectRatio: '16/9',
                x: '-50%',
                y: '-50%'
              }}
            >
              <Image 
                src={`/assets/usb-${activeUsb}-plugged-custom.png`} 
                alt="Connected" 
                fill 
                className="object-contain" 
              />
              <div className="absolute top-[48%] left-[49.5%] z-[160]" style={{ transform: 'translate(-50%, -50%) scale(0.065)' }}>
                <div 
                  className="w-14 h-14 bg-red-600 rounded-full shadow-[0_0_120px_#ff0000,0_0_60px_#ff0000]"
                  style={{ animation: 'led-blink 0.8s infinite alternate' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SoundCloud Iframe (Hidden) */}
        <iframe
          ref={iframeRef}
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACKS[1].url)}&color=%234ade80&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
          className="opacity-0 pointer-events-none absolute w-px h-px"
          allow="autoplay"
        />

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
      </div>

      <div className="mt-8 text-black/40 text-[10px] uppercase tracking-[0.4em] font-light">
        CDJ DILIO Performance Hardware Interface
      </div>
        {/* Music Tutorial - Inside the relative container for surgical alignment */}
        <MusicTutorial />
      </div> {/* End of inner max-w-1400px wrapper */}
    </section>
  );
}
