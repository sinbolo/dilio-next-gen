"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

export const Navbar3DLogo: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const processedFramesRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const totalFrames = 60;

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80, // Even more responsive
    damping: 25,
    restDelta: 0.0001 // More precision
  });

  // Map the scroll to multiple rotations
    const rawFrameIndex = useTransform(smoothProgress, [0, 1], [1, totalFrames * 3], { clamp: true });
    const frameIndex = useTransform(rawFrameIndex, (v: number) => ((Math.round(v) - 1) % totalFrames) + 1);
  

  const processImage = useCallback((img: HTMLImageElement, index: number) => {
    if (processedFramesRef.current.has(index)) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 150;
    const octx = offscreen.getContext('2d', { willReadFrequently: true });
    
    if (octx && img.complete && img.naturalWidth > 0) {
      octx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
      const imageData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
      const d = imageData.data;
      
      // Remove white background
      for (let i = 0; i < d.length; i += 4) {
        const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
        if (brightness > 235) d[i + 3] = 0;
        else if (brightness > 220) d[i + 3] = ((235 - brightness) / 15) * 255;
      }
      
      octx.putImageData(imageData, 0, 0);
      processedFramesRef.current.set(index, offscreen);
      if (index === 1) setFirstFrameReady(true);
    }
  }, []);

  // Preload and pre-process all images immediately
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);

    const loadAndProcess = (i: number) => {
      return new Promise<void>((resolve) => {
        if (imagesRef.current[i - 1]) {
          resolve();
          return;
        }
        const img = new Image();
        const num = String(i).padStart(3, '0');
        img.src = `/frames-menu/frame_${num}.jpg`;
        img.onload = () => {
          imagesRef.current[i - 1] = img;
          processImage(img, i);
          resolve();
        };
        img.onerror = () => resolve(); // Don't block if one frame fails
      });
    };

    // Load and process frames with priority for the first one
    const loadAll = async () => {
      // 1. Load and render the FIRST frame immediately
      await loadAndProcess(1);
      setFirstFrameReady(true);

      // 2. Load the rest in larger batches for speed
      const remainingFrames = Array.from({ length: totalFrames - 1 }, (_, i) => i + 2);
      const batchSize = 10;
      
      for (let i = 0; i < remainingFrames.length; i += batchSize) {
        const batch = remainingFrames.slice(i, i + batchSize).map(num => loadAndProcess(num));
        await Promise.all(batch);
        // Give the UI a tiny bit of time to breathe
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    };

    loadAll();
  }, [loadAndProcess, totalFrames]);

  const lastRenderedIndex = useRef<number>(-1);
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const currentIdx = Math.max(1, Math.min(totalFrames, Math.round(index)));
    if (currentIdx === lastRenderedIndex.current) return;
    lastRenderedIndex.current = currentIdx;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const cachedCanvas = processedFramesRef.current.get(currentIdx);
    if (cachedCanvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cachedCanvas, 0, 0, canvas.width, canvas.height);
    } else {
      const img = imagesRef.current[currentIdx - 1];
      if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Render initial frame
  useEffect(() => {
    if (firstFrameReady) {
      renderFrame(1);
    }
  }, [firstFrameReady]);

  // Handle scroll animation via MotionValue event
  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderFrame(latest);
  });

  return (
    <div className="relative w-[130px] h-[50px] cursor-pointer" onClick={onClick}>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="w-full h-full object-contain"
        style={{ 
          opacity: firstFrameReady ? 1 : 0, 
          transition: 'opacity 0.3s ease-in-out',
          willChange: 'transform' // Changed from contents to transform for better GPU optimization
        }}
      />
    </div>
  );
};
