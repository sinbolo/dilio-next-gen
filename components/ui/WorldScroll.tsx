"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useSpring } from 'framer-motion';

export const WorldScroll: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalFrames = 120;

  // Global scroll tracking
  const { scrollYProgress } = useScroll();

  // Natural drag (0.1 lerp equivalent)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // Map progress to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [1, totalFrames], { clamp: true });

  // Preload frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const preloadThreshold = Math.ceil(totalFrames * 0.3); // 30% for anti-flicker

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `/frames-tierra/frame_${frameNum}.jpg`;
        img.onload = () => {
            loadedCount++;
            if (loadedCount >= preloadThreshold && !isLoaded) {
                setIsLoaded(true);
            }
        };
        loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [totalFrames]);

  // Initial setup
  useEffect(() => {
    if (canvasRef.current && images.length > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (context) {
        const firstImg = images[0];
        canvas.width = firstImg.naturalWidth || 1080;
        canvas.height = canvas.width;
        
        const drawCentered = () => {
          const w = canvas.width;
          const h = canvas.height;
          const imgW = firstImg.naturalWidth;
          const imgH = firstImg.naturalHeight;
          const scale = Math.max(w / imgW, h / imgH);
          const x = (w / 2) - (imgW / 2) * scale;
          const y = (h / 2) - (imgH / 2) * scale;
          context.clearRect(0, 0, w, h);
          context.drawImage(firstImg, x, y, imgW * scale, imgH * scale);
          
          const imageData = context.getImageData(0, 0, w, h);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
            if (brightness < 15) {
              data[i+3] = 0;
            } else if (brightness < 30) {
              data[i+3] = ((brightness - 15) / 15) * 255;
            }
          }
          context.putImageData(imageData, 0, 0);
        }
        drawCentered();
      }
    }
  }, [images]);

  // Render loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      let currentFrame = Math.round(frameIndex.get());
      currentFrame = Math.max(1, Math.min(totalFrames, currentFrame));
      
      if (canvasRef.current && images[currentFrame - 1]) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (context) {
          const img = images[currentFrame - 1];
          const w = canvas.width;
          const h = canvas.height;
          const imgW = img.naturalWidth;
          const imgH = img.naturalHeight;
          const scale = Math.max(w / imgW, h / imgH);
          const x = (w / 2) - (imgW / 2) * scale;
          const y = (h / 2) - (imgH / 2) * scale;

          context.clearRect(0, 0, w, h);
          context.drawImage(img, x, y, imgW * scale, imgH * scale);
          
          const imageData = context.getImageData(0, 0, w, h);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
            if (brightness < 15) {
              data[i+3] = 0;
            } else if (brightness < 30) {
              data[i+3] = ((brightness - 15) / 15) * 255;
            }
          }
          context.putImageData(imageData, 0, 0);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    if (isLoaded) {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoaded, images, frameIndex]);

  return (
    <div className={className || "absolute inset-0 m-auto w-[200px] h-[200px] overflow-hidden rounded-full pointer-events-none z-20 bg-transparent"}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out'
        }}
      />
    </div>
  );
};
