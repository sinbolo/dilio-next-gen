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

  // Load frames in background — never blocks render
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    let loaded = 0;
    const BATCH = 30; // Load first 30 frames immediately

    const loadFrame = (i: number) => {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/video300_frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        imagesRef.current[i - 1] = img;
        loaded++;
        if (loaded === BATCH) setFramesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === BATCH) setFramesLoaded(true);
      };
    };

    // Load ALL frames immediately for maximum speed as requested
    for (let i = 1; i <= totalFrames; i++) {
      loadFrame(i);
    }
  }, [totalFrames]);

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

  // Handle frame changes via MotionValue event for better performance
  useEffect(() => {
    if (!framesLoaded || !isInView) return;

    const render = (latest: number) => {
      const current = Math.round(latest);
      const imgs = imagesRef.current;
      const canvas = canvasRef.current;
      
      if (current === lastIndexRef.current) return;
      lastIndexRef.current = current;

      const img = imgs[current - 1];
      if (canvas && img?.complete && img.naturalWidth > 0) {
        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) {
          if (canvas.width !== img.naturalWidth) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    // Initial render
    render(frameIndex.get());

    const unsubscribe = frameIndex.on("change", render);
    return () => unsubscribe();
  }, [framesLoaded, frameIndex, totalFrames, isInView]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-[85vw] h-[85vh] md:w-[65vw] md:h-[65vh] object-contain -translate-y-8 md:translate-y-0 mix-blend-multiply"
          style={{ opacity: framesLoaded ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}
        />
        {/* Small non-blocking loader indicator — NOT fullscreen */}
        {!framesLoaded && (
          <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
            <div className="w-4 h-4 border-2 border-black/20 border-t-black/50 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
