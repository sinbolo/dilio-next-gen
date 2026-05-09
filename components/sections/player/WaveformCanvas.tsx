"use client";

import { useEffect, useRef } from "react";

interface WaveformCanvasProps {
  isPlaying: boolean;
  isMobile: boolean;
  isInView: boolean;
}

export const WaveformCanvas = ({ isPlaying, isMobile, isInView }: WaveformCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || !isInView) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Performance optimization
    if (!ctx) return;

    let lastFrameTime = 0;
    const fpsInterval = isMobile ? 1000 / 30 : 1000 / 60;

    const render = (timestamp: number) => {
      if (timestamp - lastFrameTime < fpsInterval) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }
      lastFrameTime = timestamp;

      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;
      
      ctx.fillStyle = "#010204"; // CDJ black
      ctx.fillRect(0, 0, w, h);
      
      const barWidth = isMobile ? 8 : 2;
      const gap = isMobile ? 6 : 1;
      const step = barWidth + gap;
      const count = isMobile ? 20 : Math.ceil(w / step);
      
      offsetRef.current += isMobile ? 1.2 : 2.4; 
      
      const startI = Math.floor(offsetRef.current / step);
      const pixelOffset = offsetRef.current % step;

      for (let i = 0; i < count + 2; i++) {
        const x = isMobile ? (i * step) + (w/2 - (count*step)/2) : (i * step) - pixelOffset;
        const dataIndex = startI + i;

        const kickInterval = 32;
        const kickPos = (dataIndex % kickInterval);
        const kickEnergy = Math.pow(Math.max(0, 1 - kickPos / 4), 2) * 50;
        
        const snarePos = (dataIndex + 16) % kickInterval;
        const snareEnergy = Math.pow(Math.max(0, 1 - snarePos / 6), 2) * 35;
        
        const hatPos = (dataIndex + 8) % 16;
        const hatEnergy = Math.pow(Math.max(0, 1 - hatPos / 3), 2) * 20;
        
        const bassline = Math.sin(dataIndex * 0.12) * 12 + 18;
        const noise = (Math.sin(dataIndex * 0.5) + 1) * 5;

        const scale = 0.35;
        const low = (kickEnergy + bassline) * scale;
        const mid = (snareEnergy + noise + 8) * scale;
        const high = (hatEnergy + 5) * scale;
        
        const drawStackedBar = (direction: number) => {
          ctx.fillStyle = '#0066ff'; 
          ctx.fillRect(x, centerY, barWidth, direction * (low + (2 * scale)));
          ctx.fillStyle = '#ffcc00'; 
          ctx.fillRect(x, centerY + (direction * low), barWidth, direction * mid);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, centerY + (direction * (low + mid)), barWidth, direction * high);
        };

        drawStackedBar(-1);
        drawStackedBar(1);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, isMobile, isInView]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
};
