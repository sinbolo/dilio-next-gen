"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JogWheelProps {
  isPlaying: boolean;
  activeUsb: number;
}

export const JogWheel = memo(({ isPlaying, activeUsb }: JogWheelProps) => {
  return (
    <div className="absolute top-[69.5%] left-[50.0%] w-[5.5%] md:w-[4.5%] aspect-square -translate-x-1/2 -translate-y-1/2 z-[90] pointer-events-none">
      <div className="absolute inset-0 rounded-full border-2 border-white/5 bg-black/40 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden" />
      
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-[-100%] rounded-full pointer-events-none -translate-y-[10%] -translate-x-[5%]"
          >
            <div className="absolute inset-0 rounded-full border border-[#4ade80]/10 shadow-[inset_0_0_15px_rgba(74,222,128,0.05)]" />
            {[
              { top: '0%', left: '0%' },
              { top: '2%', left: '95%' },
              { top: '100%', left: '0%' },
              { top: '90%', left: '90%' }
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
      
      <div 
        key={`jog-marker-${activeUsb}`}
        className="absolute inset-0 rounded-full"
        style={{ 
          animation: 'jog-rotate 1.8s linear infinite',
          animationPlayState: isPlaying ? 'running' : 'paused'
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3%] h-[50%] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full" />
      </div>
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,1)] pointer-events-none" />
    </div>
  );
});

JogWheel.displayName = "JogWheel";
