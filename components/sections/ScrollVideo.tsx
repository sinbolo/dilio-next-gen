"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollVideoProps {
  totalFrames: number;
}

export const ScrollVideo: React.FC<ScrollVideoProps> = ({ totalFrames }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  // Start as ready immediately — no blocking
  const [isReady, setIsReady] = useState(true);
  const [framesLoaded, setFramesLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    bounce: 0,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [1, totalFrames], { clamp: true });

  const isMobileRef = useRef(false);

  // Intelligent Frame Batch Loading
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
    const effectiveFrames = isMobileRef.current ? Math.min(150, totalFrames) : totalFrames;
    
    imagesRef.current = new Array(effectiveFrames).fill(null);
    let loadedInBatch1 = 0;
    const BATCH1_SIZE = isMobileRef.current ? 20 : 30;
    const BATCH2_SIZE = isMobileRef.current ? 40 : 70; 

    const loadFrame = (i: number, onComplete?: () => void) => {
      if (imagesRef.current[i - 1]) return; // Already loading/loaded
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/video300_frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        imagesRef.current[i - 1] = img;
        if (onComplete) onComplete();
      };
      img.onerror = () => {
        if (onComplete) onComplete();
      };
    };

    // PHASE 1: Load first 30 frames immediately for first paint
    for (let i = 1; i <= BATCH1_SIZE; i++) {
      loadFrame(i, () => {
        loadedInBatch1++;
        if (loadedInBatch1 === BATCH1_SIZE) {
          setFramesLoaded(true);
          // PHASE 2: Load next 70 frames in background once critical path is clear
          for (let j = BATCH1_SIZE + 1; j <= BATCH1_SIZE + BATCH2_SIZE; j++) {
            loadFrame(j);
          }
        }
      });
    }

    // PHASE 3: Load the rest ONLY when user starts scrolling
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.02) { // User has started moving
        const maxFrames = isMobileRef.current ? Math.min(150, totalFrames) : totalFrames;
        for (let k = BATCH1_SIZE + BATCH2_SIZE + 1; k <= maxFrames; k++) {
          loadFrame(k);
        }
        unsubscribe(); // Only trigger once
      }
    });

    return () => unsubscribe();
  }, [totalFrames, scrollYProgress]);

  // Render loop
  const lastIndexRef = useRef(-1);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!framesLoaded || !isInView) return;
    let rafId: number;

    const render = () => {
      const imgs = imagesRef.current;
      const maxFrames = isMobileRef.current ? Math.min(150, totalFrames) : totalFrames;
      let current = Math.round(frameIndex.get());
      
      // On mobile, we remap the scroll range to our 150 frames
      if (isMobileRef.current && totalFrames > 150) {
        current = Math.round((current / totalFrames) * 150);
      }
      
      current = Math.max(1, Math.min(maxFrames, current));

      // SKIP processing if we already rendered this frame
      if (current === lastIndexRef.current) {
        rafId = requestAnimationFrame(render);
        return;
      }
      lastIndexRef.current = current;

      const img = imgs[current - 1];
      const canvas = canvasRef.current;
      if (canvas && img?.complete && img.naturalWidth > 0) {
        const ctx = canvas.getContext('2d', { willReadFrequently: false });
        if (ctx) {
          if (canvas.width !== img.naturalWidth) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, -10, canvas.width, canvas.height + 10);
        }
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesLoaded, frameIndex, totalFrames, isInView]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#ebebeb]">
        <canvas
          ref={canvasRef}
          className="w-[85vw] h-[85vh] md:w-[65vw] md:h-[65vh] object-contain -translate-y-8 md:translate-y-0"
          style={{ 
            opacity: framesLoaded ? 1 : 0, 
            transition: 'opacity 0.6s ease-in-out'
          }}
        />
        {/* Small non-blocking loader indicator — NOT fullscreen */}
        {!framesLoaded && (
          <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
            <div className="w-4 h-4 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
