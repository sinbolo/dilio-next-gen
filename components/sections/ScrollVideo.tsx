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
  // Load and render the FIRST frame immediately with absolute priority
  useEffect(() => {
    const initLoad = async () => {
      imagesRef.current = new Array(totalFrames).fill(null);
      const firstImg = new Image();
      const firstFrameNum = "001";
      firstImg.src = `/video300_frames/frame_${firstFrameNum}.jpg`;
      
      await new Promise((resolve) => {
        firstImg.onload = () => {
          imagesRef.current[0] = firstImg;
          setFramesLoaded(true);
          resolve(null);
        };
        firstImg.onerror = () => {
          setFramesLoaded(true); // Don't block even if first frame fails
          resolve(null);
        };
      });

      // After first frame is visible, load the rest in the background
      for (let i = 2; i <= totalFrames; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `/video300_frames/frame_${frameNum}.jpg`;
        img.onload = () => {
          imagesRef.current[i - 1] = img;
        };
      }
    };

    initLoad();
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

  useEffect(() => {
    if (!framesLoaded || !isInView) return;
    let rafId: number;

    const render = () => {
      const imgs = imagesRef.current;
      let current = Math.round(frameIndex.get());
      current = Math.max(1, Math.min(totalFrames, current));

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
          ctx.drawImage(img, 0, -10, canvas.width, canvas.height + 10);
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imageData.data;
            for (let i = 0; i < d.length; i += 4) {
              if (d[i] > 230 && d[i + 1] > 230 && d[i + 2] > 230) d[i + 3] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
          } catch { /* ignore cross-origin */ }
        }
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesLoaded, frameIndex, totalFrames, isInView]);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-[85vw] h-[85vh] md:w-[65vw] md:h-[65vh] object-contain -translate-y-8 md:translate-y-0"
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
