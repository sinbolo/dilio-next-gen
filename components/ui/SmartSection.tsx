"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface SmartSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  isPersistent?: boolean; // If true, never unmounts (for Music/Video PiP)
}

export function SmartSection({ 
  id, 
  children, 
  className = "", 
  minHeight = "800px",
  isPersistent = false 
}: SmartSectionProps) {
  const ref = useRef<HTMLElement>(null);
  
  // Rule C: Infinite-Ready (800px) - Pre-render when getting close
  const isInShadowRange = useInView(ref, { 
    amount: "some",
    margin: "800px 0px 800px 0px",
    once: false 
  });

  // Rule 4: Selective Memory (2000px / 1000px mobile) - Clear heavy content when far away
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const memoryMargin = isMobile ? "1000px" : "2000px";

  const isInMemoryRange = useInView(ref, { 
    amount: "some",
    margin: `${memoryMargin} 0px ${memoryMargin} 0px`,
    once: false 
  });

  // Decide what to render
  // - If persistent: always render
  // - If in 2000px range: render full content
  // - If outside 2000px: render empty div with minHeight to preserve scroll
  const shouldRenderContent = isPersistent || isInMemoryRange;

  return (
    <section 
      id={id} 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        minHeight,
        // Rule 2: content-visibility for browser-level optimization
        contentVisibility: isPersistent ? 'visible' : 'auto',
        containIntrinsicSize: `1px ${minHeight}`
      } as any}
    >
      {shouldRenderContent ? (
        <div className={`w-full h-full ${isInShadowRange ? 'gpu-accelerated' : ''}`}>
          {children}
        </div>
      ) : (
        <div style={{ height: minHeight }} /> // Empty placeholder to keep scroll stable
      )}
    </section>
  );
}
