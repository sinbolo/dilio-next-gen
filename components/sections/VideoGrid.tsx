"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { VideoTutorial } from "../ui/VideoTutorial";
import { 
  Menu, Search, Mic, Bell, Home, PlaySquare, 
  Clock, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Volume2, Play, X, Share2, Download, Heart
} from "lucide-react";

const videos = [
  { 
    id: "V22NT05Mr40", 
    title: "",
    thumbnail: "https://img.youtube.com/vi/V22NT05Mr40/maxresdefault.jpg",
    channel: "Dilio",
    views: "∞",
    time: "Timeless",
    duration: "4:20"
  },
  { 
    id: "oPyuata4gU4", 
    title: "OJEANDO FESTIVAL",
    thumbnail: "https://img.youtube.com/vi/oPyuata4gU4/maxresdefault.jpg",
    channel: "Dilio",
    views: "∞",
    time: "Eternal",
    duration: "1:15:00"
  },
  { 
    id: "placeholder1", 
    title: "MIAMI DJ SET",
    thumbnail: "",
    channel: "Dilio",
    views: "∞",
    time: "Future",
    duration: "TBA"
  },
  { 
    id: "placeholder2", 
    title: "TOMORROWLAND",
    thumbnail: "",
    channel: "Dilio",
    views: "∞",
    time: "Future",
    duration: "TBA"
  },
  { 
    id: "placeholder3", 
    title: "IBIZA CALLING",
    thumbnail: "https://images.unsplash.com/photo-1516280440502-601438515082?q=80&w=2070&auto=format&fit=crop",
    channel: "Dilio",
    views: "∞",
    time: "Future",
    duration: "TBA"
  }
];

export function VideoGrid() {
  const [activeVideo, setActiveVideo] = useState<typeof videos[0] | null>(videos[0]);
  const [isPip, setIsPip] = useState(false);
  const [pipDismissed, _setPipDismissed] = useState(false);
  const pipDismissedRef = useRef(false);
  const setPipDismissed = (val: boolean) => {
    pipDismissedRef.current = val;
    _setPipDismissed(val);
  };
  const [subscribeState, setSubscribeState] = useState<'idle' | 'redirect'>('idle');
  const [particles, setParticles] = useState<{id: number, text: string, x: number}[]>([]);
  const [likes, setLikes] = useState<{id: number, x: number, y: number, sway: number, scale: number, color: string}[]>([]);
  const [dislikes, setDislikes] = useState<{id: number, x: number, y: number, sway: number, scale: number}[]>([]);
  const [downloads, setDownloads] = useState<{id: number, x: number, y: number, sway: number, scale: number}[]>([]);
  const [shares, setShares] = useState<{id: number, x: number, y: number, sway: number, scale: number}[]>([]);
  const [bannerLang, setBannerLang] = useState<'es' | 'en'>('es');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const isPlayingRef = useRef(false);
  const playStartRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoSlotRef = useRef<HTMLDivElement>(null);
  const [videoPos, setVideoPos] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 30000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const updateVideoPos = () => {
    if (!videoSlotRef.current) return;
    const r = videoSlotRef.current.getBoundingClientRect();
    setVideoPos({ top: r.top, left: r.left, width: r.width, height: r.height });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isOutOfView = rect.bottom < 100 || rect.top > window.innerHeight - 100;
      if (isOutOfView) {
        if (!pipDismissedRef.current && isPlayingRef.current) setIsPip(true);
      } else {
        setIsPip(false);
        setPipDismissed(false);
      }
      updateVideoPos();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateVideoPos, { passive: true });
    const langInterval = setInterval(() => {
      setBannerLang(prev => prev === 'es' ? 'en' : 'es');
    }, 3000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateVideoPos);
      clearInterval(langInterval);
    };
  }, []);

  const handleClosePip = () => {
    setIsPip(false);
    setPipDismissed(true);
    setIsPlaying(false); // pause — don't null out activeVideo
  };

  const handlePlay = () => {
    setIsPlaying(true);
    playStartRef.current = Date.now();
    setPipDismissed(false);
    // Give the DOM time to render the slot, then measure its position
    setTimeout(updateVideoPos, 50);
  };

  const getElapsed = () => {
    if (!playStartRef.current) return 0;
    return Math.floor((Date.now() - playStartRef.current) / 1000);
  };

  const handleSubscribe = () => {
    // Generate TikTok style particles
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      text: i % 2 === 0 ? 'GRACIAS' : 'THANK YOU',
      x: (Math.random() - 0.5) * 120 // Random horizontal spread
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    // Clean up particles and show toast
    setTimeout(() => {
      setSubscribeState('redirect');
      setTimeout(() => {
        setSubscribeState('idle');
      }, 6000); // Hide toast after 6 seconds
    }, 1500);
  };

  const handleLike = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    const newLikes = Array.from({ length: 35 }).map((_, i) => ({
      id: Date.now() + i,
      x: spawnX + (Math.random() - 0.5) * 60, // scatter horizontally
      y: spawnY + (Math.random() - 0.5) * 20, // scatter vertically a bit
      sway: (Math.random() - 0.5) * 250, // huge random sway
      scale: 0.6 + Math.random() * 0.8,
      color: 'text-[#0a5c44]',
      delay: Math.random() * 0.3
    }));
    setLikes(prev => [...prev, ...newLikes]);
    
    setTimeout(() => {
      setLikes(prev => prev.filter(like => !newLikes.find(n => n.id === like.id)));
    }, 4000);
  };

  const handleDislike = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    const newDislikes = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: spawnX + (Math.random() - 0.5) * 60,
      y: spawnY + (Math.random() - 0.5) * 20,
      sway: (Math.random() - 0.5) * 250, // huge random sway
      scale: 0.6 + Math.random() * 0.8,
      delay: Math.random() * 0.3
    }));
    setDislikes(prev => [...prev, ...newDislikes]);
    
    setTimeout(() => {
      setDislikes(prev => prev.filter(d => !newDislikes.find(n => n.id === d.id)));
    }, 4000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    const newDownloads = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: spawnX + (Math.random() - 0.5) * 40,
      y: spawnY + (Math.random() - 0.5) * 20,
      sway: (Math.random() - 0.5) * 150,
      scale: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 0.2
    }));
    setDownloads(prev => [...prev, ...newDownloads]);
    
    setTimeout(() => {
      setDownloads(prev => prev.filter(d => !newDownloads.find(n => n.id === d.id)));
    }, 3000);
  };

  const handleShare = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2;
    const spawnY = rect.top;

    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href).catch(() => console.log('Failed to copy'));

    const newShares = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: spawnX + (Math.random() - 0.5) * 40,
      y: spawnY + (Math.random() - 0.5) * 20,
      sway: (Math.random() - 0.5) * 150,
      scale: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 0.2
    }));
    setShares(prev => [...prev, ...newShares]);
    
    setTimeout(() => {
      setShares(prev => prev.filter(s => !newShares.find(n => n.id === s.id)));
    }, 3000);
  };

  return (
    <section ref={sectionRef} id="section-video" className="min-h-screen relative flex items-center justify-center bg-[#0a0a0a] text-white py-[120px] overflow-hidden">
      <VideoTutorial />
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 flex flex-col gap-12 items-center">
        


        {/* Floating iPad Mockup */}
        <div 
          className="relative w-full max-w-[1200px] aspect-[4/3] md:aspect-[16/10] bg-[#1a1a1a] rounded-[2rem] md:rounded-[3rem] p-3 md:p-[22px] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_60px_rgba(0,0,0,0.8),inset_0_0_0_2px_#333,inset_0_0_20px_rgba(0,0,0,1)] ring-1 ring-black"
        >
          {/* Metallic Edge Highlight */}
          <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none"></div>

          {/* Camera Lens */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#050505] shadow-[inset_0_1px_2px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.1)] border border-[#111] flex items-center justify-center">
            <div className="w-1 h-1 bg-[#102040] rounded-full blur-[0.5px]"></div>
          </div>
          
          {/* Screen Area */}
          <div className="relative w-full h-full bg-[#0f0f0f] rounded-[1.5rem] md:rounded-[2.2rem] overflow-hidden flex flex-col border border-black shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
            
            {/* TikTok Style Toast Popup */}
            <AnimatePresence>
              {subscribeState === 'redirect' && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                  exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
                  className="absolute bottom-8 left-1/2 bg-[#051a13]/95 backdrop-blur-xl border border-[#0a5c44]/20 p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 w-[90%] max-w-[360px] flex flex-col items-center text-center"
                >
                   <div className="flex flex-col items-center mb-3">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                       ESTO ES DILIOTUBE
                     </h3>
                     <h3 className="text-xs font-black text-[#0a5c44] uppercase tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>
                       THIS IS DILIOTUBE
                     </h3>
                   </div>

                   <div className="flex flex-col items-center gap-1 mb-5">
                     <p className="text-sm text-white/90 font-medium">
                       Para una suscripción real, dirígete a mi canal oficial de YouTube.
                     </p>
                     <p className="text-[11px] text-white/50 font-medium leading-tight">
                       For a real subscription, head over to my official YouTube channel.
                     </p>
                   </div>

                   <a 
                     href="https://youtube.com/@Diliomusic" 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex flex-col items-center bg-[#0a5c44] text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-[#051a13] transition-colors w-full"
                     onClick={() => setSubscribeState('idle')}
                   >
                     <span>Ir a YouTube</span>
                     <span className="text-[9px] font-black opacity-70">GO TO YOUTUBE</span>
                   </a>
                   
                   <button 
                     onClick={() => setSubscribeState('idle')}
                     className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                   >
                     <X className="w-4 h-4 text-white/50 hover:text-white" />
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* iPad Status Bar */}
            <div className="h-6 w-full flex justify-between items-center px-6 text-[10.5px] font-medium text-white/80 select-none bg-[#0f0f0f] z-30">
              <span>{currentTime}</span>
              <div className="flex gap-2 items-center">
                <span className="tracking-tighter">5G</span>
                <div className="w-5 h-2.5 border border-white/60 rounded-sm p-[1px] flex">
                  <div className="w-[80%] h-full bg-white rounded-[1px]"></div>
                </div>
              </div>
            </div>

            {/* YouTube UI Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0 bg-[#0f0f0f] z-[250]">
              <div className="flex items-center gap-4">
                <Menu className="w-6 h-6 text-white/90 cursor-pointer" />
                <div className="flex items-center gap-1 cursor-pointer">
                  <div className="w-8 h-8 bg-[#0a5c44] rounded-lg flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tighter text-[#0a5c44] ml-1" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>Diliotube</span>
                </div>
              </div>
              
              <div className="hidden md:flex flex-1 max-w-xl items-center gap-4 ml-10">
                <div className="flex flex-1 items-center bg-[#121212] border border-white/10 rounded-full overflow-hidden">
                  <input type="text" placeholder="Search" className="flex-1 bg-transparent px-5 py-2 outline-none text-white/90 text-sm" />
                  <button className="px-5 py-2 bg-white/5 border-l border-white/10 hover:bg-white/10 transition-colors">
                    <Search className="w-5 h-5 text-white/70" />
                  </button>
                </div>
                <button className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                  <Mic className="w-5 h-5 text-white/90" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white/90" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#051a13] to-[#0a5c44] flex items-center justify-center p-0.5 cursor-pointer">
                   <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                     <img src="/assets/logo 3d estatico verde.png" alt="Dilio" className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_5px_rgba(10,92,68,0.5)]" />
                   </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative bg-[#0f0f0f]">
              
              {/* Mini Sidebar */}
              <div className="hidden md:flex flex-col w-[72px] border-r border-white/10 py-3 overflow-y-auto shrink-0 bg-[#0f0f0f] z-[250] items-center gap-6">
                <button className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white group">
                  <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white group">
                  <PlaySquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium">Shorts</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white group">
                  <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium">Subs</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 text-white/90 hover:text-white group">
                  <Clock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium">Library</span>
                </button>
              </div>

              {/* Dynamic Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">

                {/* SPLIT PANE — video selected and not in PiP */}
                {activeVideo && !isPip && (
                  <div className="p-4 md:p-6 flex flex-col xl:flex-row gap-6 w-full">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* Back button */}
                      <button onClick={() => setActiveVideo(null)} className="self-start flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm relative z-[250]">
                        <ChevronLeft className="w-4 h-4" />
                        <span>All videos</span>
                      </button>
                      {/* Video slot — always shows thumbnail until play, then acts as placeholder while iframe is in portal */}
                      <div ref={videoSlotRef} className="w-full bg-black relative aspect-video rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        {activeVideo.id.startsWith("placeholder") ? (
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black/80 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,92,68,0.15)_0%,transparent_70%)] animate-pulse"></div>
                            <Play className="w-16 h-16 text-[#0a5c44]/20 mb-6 drop-shadow-2xl relative z-10" />
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2 relative z-10" style={{ fontFamily: 'var(--font-display)' }}>
                              {activeVideo.id === "placeholder1" ? "Miami Heat Approaching" : activeVideo.id === "placeholder3" ? "The Island Is Calling" : "A Vision Yet To Be Manifested"}
                            </h3>
                            <p className="text-white/60 font-medium max-w-md text-sm md:text-base relative z-10">
                              {activeVideo.id === "placeholder1" ? "Exclusive sets and unseen footage from Miami are being curated for future release. Stay connected." : activeVideo.id === "placeholder3" ? "Sunset frequencies and underground rhythms. This transmission from Ibiza is scheduled for the upcoming season." : "The timeline is aligning. This frequency will be broadcasted live and recorded in the near future. The stage awaits."}
                            </p>
                          </div>
                        ) : !isPlaying ? (
                          <div className="absolute inset-0 z-20 cursor-pointer group flex items-center justify-center overflow-hidden" onClick={handlePlay}>
                            <img src={activeVideo.thumbnail} alt={activeVideo.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            <div className="relative z-30 w-20 h-20 bg-[#0a5c44]/90 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(10,92,68,0.5)] transform transition-transform group-hover:scale-110">
                              <Play className="w-8 h-8 text-white ml-1 fill-white" />
                            </div>
                          </div>
                        ) : (
                          /* Placeholder while the real iframe lives in the portal above */
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#0a5c44]/40 animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      <h1 className="text-xl md:text-2xl font-bold mt-1 line-clamp-2 leading-tight">{activeVideo.title}</h1>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                            <img src="/assets/logo 3d estatico verde.png" alt="Dilio" className="w-[70%] h-[70%] object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white/90">{activeVideo.channel}</span>
                            <span className="text-[13px] text-white/60">A dedicated collective</span>
                          </div>
                          <div className="relative">
                            <button onClick={handleSubscribe} className="ml-3 bg-white text-black px-4 py-2 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors">Subscribe</button>
                            <AnimatePresence>
                              {particles.map(p => (
                                <motion.div key={p.id} initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }} animate={{ opacity: 0, y: -100 - Math.random() * 100, x: p.x, scale: 1.5 }} transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }} className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none text-[#0a5c44] font-black text-xs md:text-sm drop-shadow-[0_0_8px_rgba(10,92,68,0.8)] whitespace-nowrap z-50" style={{ fontFamily: 'var(--font-display)' }}>{p.text}</motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                          <div className="flex bg-white/10 rounded-full shrink-0">
                            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-white/20 transition-colors border-r border-white/10 rounded-l-full"><ThumbsUp className="w-4 h-4" /> <span className="text-sm font-medium">Art {'>'} Ego</span></button>
                            <button onClick={handleDislike} className="px-4 py-2 hover:bg-white/20 transition-colors rounded-r-full"><ThumbsDown className="w-4 h-4" /></button>
                          </div>
                          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-medium shrink-0"><Share2 className="w-4 h-4" /> Share</button>
                          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-medium shrink-0 hidden sm:flex"><Download className="w-4 h-4" /> Download</button>
                        </div>
                      </div>

                      <div className="mt-2 bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-3 text-sm cursor-pointer">
                        <span className="font-medium text-white/90">{activeVideo.views} • {activeVideo.time}</span>
                        <p className="mt-2 text-white/80 leading-relaxed">Experience the immersive soundscapes of Dilio. This transmission was recorded live and mastered for maximum fidelity.<br/><br/>Subscribe for more exclusive content. Follow us on all platforms.</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full xl:w-[350px] flex flex-col gap-4 shrink-0">
                      <div className="relative w-full rounded-xl overflow-hidden group cursor-pointer border border-white/5 shadow-[0_0_15px_rgba(10,92,68,0.05)] hover:shadow-[0_0_20px_rgba(10,92,68,0.15)] transition-shadow">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#042f1f] opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 grayscale"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                        <div className="relative p-4 flex flex-col h-full z-10 min-h-[160px]">
                          <AnimatePresence mode="wait">
                            <motion.div key={bannerLang} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.4 }} className="flex flex-col h-full flex-1 justify-between">
                              <div className="flex justify-between items-start">
                               <span className="bg-[#0a5c44]/20 text-[#0a5c44] border border-[#0a5c44]/30 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">{bannerLang === 'es' ? 'Próximo Show' : 'Next Show'}</span>
                                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-black/40"><div className="w-2 h-2 bg-[#0a5c44] rounded-full animate-pulse shadow-[0_0_8px_rgba(10,92,68,0.8)]"></div></div>
                              </div>
                              <div className="mt-auto">
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none" style={{ fontFamily: 'var(--font-display)' }}>{bannerLang === 'es' ? 'Sábado 27 Junio' : 'Saturday, Jun 27'}</h3>
                                <p className="text-white/60 font-bold text-xs tracking-wide mt-1 uppercase">{bannerLang === 'es' ? 'Escenario Molino • Ojén, Málaga' : 'Molino Stage • Ojén, Málaga'}</p>
                                <div className="mt-4 inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 group-hover:border-[#0a5c44]/50 transition-colors">
                                  <span className="text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#0a5c44] transition-colors">{bannerLang === 'es' ? 'Entrada gratuita' : 'Free Entry'}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1 hidden xl:block mt-2">Up next</h3>
                      {videos.map(vid => (
                        <div key={vid.id} className="flex gap-3 group cursor-pointer" onClick={() => { setActiveVideo(vid); setIsPlaying(false); playStartRef.current = null; }}>
                          <div className="w-[160px] aspect-video rounded-lg overflow-hidden relative shrink-0 bg-[#1a1a1a]">
                            {vid.thumbnail ? (
                              <img src={vid.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#111]">
                                <PlaySquare className="w-6 h-6 text-white/10" />
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium">{vid.duration}</div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><Play className="w-6 h-6 fill-white drop-shadow-lg" /></div>
                          </div>
                          <div className="flex flex-col py-0.5 pr-2">
                            <h3 className="text-white/90 font-medium text-[15px] line-clamp-2 leading-tight group-hover:text-white transition-colors">{vid.title}</h3>
                            <span className="text-[13px] text-white/60 mt-1">{vid.channel}</span>
                            <span className="text-[13px] text-white/60">{vid.views} • {vid.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* GRID — default view or when PiP is active */}
                {(!activeVideo || isPip) && (
                  <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
                    {videos.map((vid) => (
                      <div key={vid.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => { setActiveVideo(vid); setIsPlaying(false); playStartRef.current = null; setIsPip(false); setPipDismissed(false); }}>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a]">
                          {vid.thumbnail ? (
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] relative overflow-hidden">
                              <PlaySquare className="w-12 h-12 text-white/5 mb-2" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]"></div>
                              {/* Animated loading pulse line */}
                              <motion.div 
                                animate={{ x: ['-100%', '200%'] }} 
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-[-20deg]"
                              />
                            </div>
                          )}
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">{vid.duration}</div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-md"><Play className="w-5 h-5 fill-white ml-1" /></div>
                          </div>
                        </div>
                        <div className="flex gap-3 pr-4">
                          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                            <img src="/assets/logo 3d estatico verde.png" alt="Dilio" className="w-[70%] h-[70%] object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-white/90 font-medium line-clamp-2 leading-tight group-hover:text-white transition-colors">{vid.title}</h3>
                            <span className="text-[13px] text-white/60 mt-1">{vid.channel}</span>
                            <span className="text-[13px] text-white/60">{vid.views} • {vid.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div> {/* end overflow-y-auto */}
            </div> {/* end flex main content */}

            {/* iPad Home Indicator Line */}
            <div className="h-1.5 w-32 bg-white/20 rounded-full mx-auto mb-2 mt-1 z-30"></div>
          </div>
        </div>
      </div>

      {mounted && isPlaying && activeVideo && !activeVideo.id.startsWith("placeholder") && createPortal(
        (() => {
          const pipW = typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 380;
          const pipH = Math.round(pipW * 9 / 16);
          return (
            <div
              className="group"
              style={isPip ? {
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                width: `${pipW}px`,
                height: `${pipH}px`,
                zIndex: 99999,
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              } : {
                position: 'fixed',
                top: `${videoPos.top}px`,
                left: `${videoPos.left}px`,
                width: `${videoPos.width}px`,
                height: `${videoPos.height}px`,
                zIndex: 50,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
              {isPip && (
                <button
                  onClick={handleClosePip}
                  style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                  className="w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>
          );
        })(),
        document.body
      )}


      {/* Global Floating Actions (Likes/Dislikes) */}
      {mounted && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          <AnimatePresence>
          {likes.map(like => (
            <motion.div
              key={like.id}
              initial={{ opacity: 0, y: like.y, x: like.x, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: like.y - 200 - Math.random() * 200, 
                x: [like.x, like.x + like.sway, like.x - like.sway, like.x + like.sway * 1.5], 
                scale: like.scale 
              }}
              transition={{ duration: 1.5 + Math.random() * 1.5, ease: "easeOut", times: [0, 0.1, 0.8, 1], delay: (like as any).delay }}
              className={`absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 ${like.color}`}
            >
              <Heart className="w-12 h-12 fill-current drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
            </motion.div>
          ))}
          {dislikes.map(d => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: d.y, x: d.x, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: d.y - 200 - Math.random() * 200, 
                x: [d.x, d.x + d.sway, d.x - d.sway, d.x + d.sway * 1.5], 
                scale: d.scale 
              }}
              transition={{ duration: 1.5 + Math.random() * 1.5, ease: "easeOut", times: [0, 0.1, 0.8, 1], delay: (d as any).delay }}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            >
              🖕
            </motion.div>
          ))}
          {downloads.map(d => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: d.y, x: d.x, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: d.y - 150 - Math.random() * 100, 
                x: [d.x, d.x + d.sway, d.x - d.sway, d.x + d.sway], 
                scale: d.scale 
              }}
              transition={{ duration: 1.5 + Math.random() * 1.5, ease: "easeOut", times: [0, 0.1, 0.8, 1], delay: (d as any).delay }}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            >
              🏴‍☠️
            </motion.div>
          ))}
          {shares.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: s.y, x: s.x, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: s.y - 150 - Math.random() * 100, 
                x: [s.x, s.x + s.sway, s.x - s.sway, s.x + s.sway], 
                scale: s.scale 
              }}
              transition={{ duration: 1.5 + Math.random() * 1.5, ease: "easeOut", times: [0, 0.1, 0.8, 1], delay: (s as any).delay }}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            >
              🔗
            </motion.div>
          ))}
        </AnimatePresence>
      </div>,
      document.body
      )}

    </section>
  );
}
