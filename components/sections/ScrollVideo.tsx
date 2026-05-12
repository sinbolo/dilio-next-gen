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

  // 1. Shadow Range Observer: Pre-load frames before they are in view
  const [isNearView, setIsNearView] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const memoryMargin = isMobile ? "40px" : "1000px";
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearView(entry.isIntersecting),
      { rootMargin: `${memoryMargin} 0px ${memoryMargin} 0px` } 
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. RAM Management Observer: Flush cache when far away
  const [isInView, setIsInView] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Intelligent Frame Management (Load/Flush)
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
    const effectiveFrames = isMobileRef.current ? Math.min(150, totalFrames) : totalFrames;

    const loadFrame = (i: number, onComplete?: () => void) => {
      if (!imagesRef.current || imagesRef.current[i - 1]) return;
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/video300_frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        if (imagesRef.current) imagesRef.current[i - 1] = img;
        if (onComplete) onComplete();
      };
    };

    if (isNearView) {
      // Load/Re-hydrate frames
      if (!imagesRef.current || imagesRef.current.length === 0) {
        imagesRef.current = new Array(effectiveFrames).fill(null);
      }
      
      // Critical Path: Load first 30
      for (let i = 1; i <= (isMobileRef.current ? 20 : 30); i++) {
        loadFrame(i, () => {
          if (i === (isMobileRef.current ? 20 : 30)) setFramesLoaded(true);
        });
      }

      // Background Path: Load rest if user scrolls or is just near
      const maxToLoad = isMobileRef.current ? 150 : totalFrames;
      for (let k = 31; k <= maxToLoad; k++) {
        loadFrame(k);
      }
    } else {
      // FLUSH RAM: Completely clear the image objects to free ~1GB of decoded data
      if (imagesRef.current) {
        imagesRef.current.forEach((img, idx) => {
          if (img) {
            img.onload = null;
            img.src = ""; // Stop any pending loads
            if (imagesRef.current) imagesRef.current[idx] = null;
          }
        });
        imagesRef.current = [];
        setFramesLoaded(false);
      }
    }
  }, [isNearView, totalFrames]);

  // 4. Render loop
  const lastIndexRef = useRef(-1);

  useEffect(() => {
    if (!framesLoaded || !isInView) return;
    let rafId: number;

    const render = () => {
      const imgs = imagesRef.current;
      if (!imgs || imgs.length === 0) return;

      const maxFrames = isMobileRef.current ? Math.min(150, totalFrames) : totalFrames;
      let current = Math.round(frameIndex.get());
      
      if (isMobileRef.current && totalFrames > 150) {
        current = Math.round((current / totalFrames) * 150);
      }
      
      current = Math.max(1, Math.min(maxFrames, current));

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
    <div ref={containerRef} className="relative w-full h-[50vh]">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#ebebeb]">
        <canvas
          ref={canvasRef}
          className="w-[85vw] h-[85vh] md:w-[65vw] md:h-[65vh] object-contain -translate-y-8 md:translate-y-0"
          style={{ 
            opacity: framesLoaded ? 1 : 0, 
            transition: 'opacity 0.6s ease-in-out'
          }}
        />
        {!framesLoaded && isNearView && (
          <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
            <div className="w-4 h-4 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
