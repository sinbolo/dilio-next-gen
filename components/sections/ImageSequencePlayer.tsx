"use client";

import { useEffect, useRef, useState } from "react";

interface ImageSequencePlayerProps {
  frameCount: number;
  basePath: string; // e.g., "/frames_bio/frame_"
  extension: string; // e.g., ".webp"
  fps?: number;
  className?: string;
}

export function ImageSequencePlayer({
  frameCount,
  basePath,
  extension,
  fps = 24,
  className = "",
}: ImageSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const frameIndexRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const loadImage = (index: number) => {
      const img = new Image();
      const frameNumber = (index + 1).toString().padStart(4, "0");
      img.src = `${basePath}${frameNumber}${extension}`;
      
      img.onload = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${img.src}`);
        setError(`Error cargando el frame ${frameNumber}`);
      };

      loadedImages[index] = img;
    };

    for (let i = 0; i < frameCount; i++) {
      loadImage(i);
    }

    return () => {
      // Cleanup if needed
    };
  }, [frameCount, basePath, extension]);

  // Animation Loop
  useEffect(() => {
    if (isLoading || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interval = 1000 / fps;

    const animate = (time: number) => {
      const deltaTime = time - lastTimeRef.current;

      if (deltaTime > interval) {
        lastTimeRef.current = time - (deltaTime % interval);

        // Clear and Draw
        const img = images[frameIndexRef.current];
        if (img && img.complete) {
          // Adjust canvas size to match image aspect ratio if needed, 
          // or just stretch/fill. User wants responsive.
          if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }

          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
        }
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isLoading, images, frameCount, fps]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-visible ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
          <div className="w-48 h-[1px] bg-black/5 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-black/20 uppercase tracking-[0.4em] font-bold">
            Loading Sequence // {progress}%
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-black/40 text-[10px] uppercase tracking-widest">
          {error}
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain transition-opacity duration-1000"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
}
