"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { WaveformCanvas } from "./WaveformCanvas";

interface LCDDisplayProps {
  activeUsb: number;
  isConnecting: number;
  isPlaying: boolean;
  currentTime: string;
  progress: number;
  duration: number;
  trackInfo: any;
  isMobile: boolean;
  isInView: boolean;
  onSeek: (e: React.MouseEvent) => void;
  onPlayClick: () => void;
}

export const LCDDisplay = memo(({ 
  activeUsb, 
  isConnecting, 
  isPlaying, 
  currentTime, 
  progress, 
  duration, 
  trackInfo, 
  isMobile, 
  isInView,
  onSeek,
  onPlayClick
}: LCDDisplayProps) => {
  return (
    <div 
      onClick={onPlayClick}
      className={`absolute top-[10.5%] left-[37.7%] w-[24.5%] h-[26.5%] ${isMobile ? '' : 'overflow-hidden'} rounded-[2px] cursor-pointer z-40 flex flex-col group bg-[#020406] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]`}
    >
      <div className="absolute inset-0 pointer-events-none z-[100] shadow-[inset_0_0_25px_rgba(0,0,0,1)] opacity-70" />
      
      <div className="relative h-full w-full flex flex-col font-sans select-none overflow-hidden">
        {/* TOP BAR */}
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

        {/* MAIN DISPLAY */}
        <div className="flex-1 flex gap-3 px-3 py-1">
          <div className="w-[18%] flex flex-col justify-between py-1">
            <div className={`aspect-square w-[98%] mx-auto rounded overflow-hidden mb-2 shadow-lg relative transition-all duration-500 border ${
              activeUsb === 1 ? 'bg-yellow-400 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10'
            }`}>
              <motion.div
                key={activeUsb}
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
                    activeUsb === 1 ? 'opacity-100 grayscale contrast-[2] brightness-[0.8] mix-blend-multiply' : 'opacity-90 contrast-125 grayscale'
                  }`}
                  style={{ filter: activeUsb === 1 ? 'sepia(1) saturate(5)' : 'none' }}
                />
                <motion.div 
                  initial={{ top: '100%' }}
                  animate={{ top: '0%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[1px] bg-white shadow-[0_0_8px_white] z-10"
                />
              </motion.div>
            </div>

            <div>
              <div className={`text-[4px] md:text-[7px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1 ${isMobile ? 'translate-y-[16px]' : ''}`}>Track</div>
              <div className="overflow-hidden w-full whitespace-nowrap">
                <motion.div 
                  className="inline-block"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-[5px] md:text-[10px] font-black text-white leading-none uppercase tracking-tight pr-10">
                    {isConnecting ? "LOADING..." : trackInfo?.name}
                  </span>
                  <span className="text-[5px] md:text-[10px] font-black text-white leading-none uppercase tracking-tight pr-10">
                    {isConnecting ? "LOADING..." : trackInfo?.name}
                  </span>
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-5 md:h-5 bg-[#007aff] flex items-center justify-center rounded-sm text-[6px] md:text-[9px] font-black text-white flex-shrink-0">1</div>
              <div>
                <div className="text-[5px] md:text-[7px] text-white/40 font-bold uppercase tracking-widest leading-none mb-1">Artist</div>
                <div className="text-[7px] md:text-[10px] font-medium text-white/60 truncate leading-none uppercase">
                  {isConnecting ? "---" : trackInfo?.artist}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative">
            <div className="flex-1 relative mt-5 mb-5 overflow-hidden rounded bg-[#010204] border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.05]" 
                style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)', backgroundSize: '100% 4px' }} 
              />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#ff0000] z-30 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
              
              <WaveformCanvas isPlaying={isPlaying} isMobile={isMobile} isInView={isInView} />

              <div className="absolute inset-0 pointer-events-none flex justify-between px-1 opacity-[0.06] z-10">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-white/40" />
                ))}
              </div>
            </div>

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

          <div className="w-[18%] flex flex-col items-end justify-between py-1 pb-0 relative" />
        </div>

        {/* BOTTOM WAVEFORM OVERVIEW */}
        <div 
          className={`w-full bg-[#010204] px-3 py-1.5 overflow-hidden flex flex-col justify-center border-t border-white/10 cursor-pointer ${isMobile ? 'absolute bottom-0 left-0 right-0 h-[20%] z-[999]' : 'relative h-[20%] z-50'}`}
          onClick={onSeek}
        >
          <div className={`flex items-center h-full gap-[0.5px] ${isMobile ? 'opacity-100' : 'opacity-40'}`}>
            {Array.from({ length: 200 }).map((_, i) => {
              let structureMultiplier = 0.3;
              if ((i > 40 && i < 80) || (i > 120 && i < 170)) structureMultiplier = 1.0;
              if (i >= 80 && i <= 120) structureMultiplier = 0.4;
              const h = Math.max(15, (Math.abs(Math.sin(i * 0.1)) * 50 + Math.random() * 30) * structureMultiplier);
              return (
                <div key={i} className="flex-1" style={{ height: `${h}%`, background: `linear-gradient(to bottom, #0055ff 0%, #ffaa00 50%, #0055ff 100%)` }} />
              );
            })}
          </div>
          <div 
            className="absolute top-0 bottom-0 left-0 bg-white/10 border-r-[3px] border-[#ff0000] shadow-[0_0_20px_rgba(255,0,0,0.7)] transition-all duration-100"
            style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
          />
        </div>

        <div className={`absolute bottom-3 right-6 flex flex-col items-center pointer-events-none ${isMobile ? 'z-[1000] translate-y-[10px]' : 'z-[110]'}`}>
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
              {isConnecting ? "---" : trackInfo?.bpm}
            </div>
          </div>
          <div className="text-[5px] md:text-[7px] font-bold text-white/80 tracking-tighter uppercase tabular-nums">
            {trackInfo?.key}
          </div>
        </div>
      </div>
    </div>
  );
});

LCDDisplay.displayName = "LCDDisplay";
