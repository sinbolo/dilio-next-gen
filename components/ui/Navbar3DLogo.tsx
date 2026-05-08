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
    
    // No longer pre-processing background in JS. 
    // We will use CSS mix-blend-multiply for a much lighter experience.
    processedFramesRef.current.set(index, img as any);
    if (index === 1) setFirstFrameReady(true);
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

    // Load frames in small batches to avoid choking the connection on mobile
    const loadSequentially = async () => {
      const batchSize = 5;
      for (let i = 1; i <= totalFrames; i += batchSize) {
        const batch = [];
        for (let j = 0; j < batchSize && (i + j) <= totalFrames; j++) {
          batch.push(loadAndProcess(i + j));
        }
        await Promise.all(batch);
        // Small breathing room for the main thread
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };

    loadSequentially();
  }, [processImage, totalFrames]);

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
        className="w-full h-full object-contain mix-blend-multiply"
        style={{ 
          opacity: firstFrameReady ? 1 : 0, 
          transition: 'opacity 0.3s ease-in-out',
          willChange: 'transform'
        }}
      />
    </div>
  );
};
