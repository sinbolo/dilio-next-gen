"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCart } from "@/lib/CartContext";
import { ShoppingBag } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { MerchTutorial } from "../ui/MerchTutorial";

const products = [
  {
    id: "prod_03",
    name: "THE KEYCHAIN",
    sub: "BRASS & ONYX // ENGRAVED",
    price: 25,
    image: "/assets/merch key.png",
    bg: "bg-[#161616]",
    veil: "/assets/Sabana_3_Unified_cutout.png",
    vS: 0.44,
    vX: '0%',
    vY: '0%'
  },
  {
    id: "prod_02",
    name: "DILIO CAP",
    sub: "STRUCTURED BLACK // ADJUSTABLE",
    price: 35,
    image: "/assets/borra merch.png",
    bg: "bg-[#0a0a0a]",
    veil: "/assets/Sabana_2_Master_Infinity_cutout.png",
    vS: 0.44,
    vX: '0%',
    vY: '-3.41%'
  },
  {
    id: "prod_01",
    name: "DILIO SOCKS",
    sub: "PREMIUM COTTON // 2-PACK",
    price: 15,
    image: "/assets/merch calcetines 2.png",
    bg: "bg-[#111]",
    veil: "/assets/Sabana_1_Unified_Final_cutout.png",
    vS: 0.44,
    vX: '0%',
    vY: '0%'
  }
];






function ProductCard({ 
  product, 
  addItem, 
  sectionRef,
  onMeasure 
}: { 
  product: typeof products[0], 
  addItem: any, 
  sectionRef: React.RefObject<HTMLElement | null>,
  onMeasure: (id: string, rect: DOMRect) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateOffset = () => {
      if (cardRef.current && sectionRef.current) {
        const cRect = cardRef.current.getBoundingClientRect();
        // Report position to parent for individual veil masking
        onMeasure(product.id, cRect);
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    window.addEventListener('scroll', updateOffset, { passive: true });
    
    return () => {
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('scroll', updateOffset);
    };
  }, [sectionRef, onMeasure, product.id]);

  return (
    <div 
      ref={cardRef}
      data-measure={product.id}
      className="group flex flex-col relative w-[85%] mx-auto aspect-[2/3] bg-transparent rounded-sm isolate border border-transparent transition-transform duration-500 cursor-none"
    >
      {/* 0. Base Content Layer (Clipped) */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-sm">
        <div 
          className="absolute inset-0 z-5 flex items-center justify-center p-12 transition-all duration-1000"
          data-product-mask={product.id}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-transform duration-1000 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>


      {/* 3. Interaction UI (Metadata container - Guided by proximity opacity) */}
      <div 
        data-metadata-container={product.id}
        onClick={() => addItem(product)}
        className="absolute inset-0 z-50 opacity-0 flex flex-col items-center justify-center pt-48 p-8 font-display pointer-events-auto transition-opacity duration-500 text-center"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-0 opacity-0" 
          data-product-background={product.id}
        />
        
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Triple Layer Reveal (Chemical Ignition) */}
          <div className="relative mb-1 w-full">
             {/* 1. Dormant */}
              <h3 className="absolute inset-0 text-3xl font-black text-[#52ff88]/20 blur-[3px] drop-shadow-[0_0_25px_rgba(82,255,136,0.4)] uppercase tracking-tighter leading-none">{product.name}</h3>
             {/* 2. Ignition (Masked Wide) */}
              <h3 className="absolute inset-0 text-3xl font-black text-[#52ff88] blur-[1px] drop-shadow-[0_0_30px_rgba(82,255,136,0.6)] uppercase tracking-tighter leading-none" data-text-mask="glow">{product.name}</h3>
             {/* 3. Crystallized (Masked Tight) */}
              <h3 className="relative z-10 text-3xl font-black text-white uppercase tracking-tighter leading-none" data-text-mask="clean">{product.name}</h3>
          </div>

          <div className="relative mb-3 w-full">
             {/* 1. Dormant */}
              <p className="absolute inset-0 text-[10px] text-[#52ff88]/15 blur-[1.5px] tracking-[0.4em] uppercase font-black italic drop-shadow-[0_0_10px_rgba(82,255,136,0.3)]">{product.sub}</p>
             {/* 2. Ignition (Masked Wide) */}
              <p className="absolute inset-0 text-[10px] text-[#52ff88] blur-[0.5px] tracking-[0.4em] uppercase font-black italic drop-shadow-[0_0_15px_rgba(82,255,136,0.5)]" data-text-mask="glow">{product.sub}</p>
             {/* 3. Crystallized (Masked Tight) */}
              <p className="relative z-10 text-[10px] text-white/40 tracking-[0.4em] uppercase font-black italic" data-text-mask="clean">{product.sub}</p>
          </div>

          {/* Ignite Button (Triple Stage) */}
          <div className="relative w-3/4 mx-auto overflow-hidden rounded-sm">
            {/* 1. Dormant Glow */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#52ff88]/5 border border-[#52ff88]/10 blur-[1.5px]">
               <span className="text-[#52ff88]/20 font-black tracking-[0.4em] text-[8px]">ADD TO CART</span>
            </div>

            {/* 2. Ignition Front (Masked Wide) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#52ff88] shadow-[0_0_40px_rgba(82,255,136,0.7)]" data-text-mask="glow">
               <span className="text-white font-black tracking-[0.4em] text-[8px]">ADD TO CART</span>
            </div>

            {/* 3. Crystallized Core (Masked Tight) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
              data-text-mask="clean"
              className="relative z-20 w-full py-2 bg-white text-black font-black tracking-[0.4em] text-[8px] hover:bg-primary transition-colors flex items-center justify-center gap-2 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto cursor-none"
            >
              ADD TO CART // {product.price} €
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 border-[1px] border-transparent pointer-events-none z-45" />

      {/* 4. THE VEIL - NOW INSIDE AND OVERLAYING BORDERS */}
      <img
        data-veil={product.id}
        src={product.veil}
        alt=""
        className="absolute max-w-none pointer-events-none z-[100] origin-center opacity-100 transition-opacity duration-1000 top-1/2 left-1/2"
        style={{
          transform: `translate(-50%, calc(-50% + ${product.vY || '0%'})) scale(${product.vS || 1})`,
          filter: `brightness(var(--veil-brightness, 0.45)) drop-shadow(0 0 30px rgba(0,0,0,1))`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat'
        } as any}
      />
    </div>
  );
}

export function MerchGallery() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isHoveringRef = useRef(false);
  
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, isCartOpen, setIsCartOpen, unlockFreeShipping } = useCart();
  const cardRectsRef = useRef<Record<string, DOMRect>>({});
  const [rectsLoaded, setRectsLoaded] = useState(false);
  
  // High-performance refs for the physics loop
  const flareRef = useRef<HTMLDivElement>(null);
  const veilsRef = useRef<HTMLElement[]>([]);
  const cardsRef = useRef<HTMLElement[]>([]);
  const textMasksRef = useRef<HTMLElement[]>([]);
  const easterEggsRef = useRef<HTMLElement[]>([]);
  const eggRectsRef = useRef<Record<string, DOMRect>>({});
  const hasAutoAddedRef = useRef(false);
  const flashOverlayRef = useRef<HTMLDivElement>(null);

  // Store motion values in refs for stable RAF access
  const mouseXRef = useRef(mouseX);
  const mouseYRef = useRef(mouseY);
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);
  
  // 1. Element Discovery & Rect Caching (Run on mount and when items might change)
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const updateCache = () => {
      if (!sectionRef.current) return;
      
      // 1. Discover elements first
      cardsRef.current = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-measure]'));
      veilsRef.current = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-veil]'));
      textMasksRef.current = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-text-mask]'));
      easterEggsRef.current = Array.from(sectionRef.current.querySelectorAll<HTMLElement>('[data-easter-egg]'));
      
      const newCardRects: Record<string, DOMRect> = {};
      const newEggRects: Record<string, DOMRect> = {};

      // 2. Measure everything in one go
      cardsRef.current.forEach(card => {
        const id = card.getAttribute('data-measure');
        if (id) {
          newCardRects[id] = card.getBoundingClientRect();
        }
      });

      easterEggsRef.current.forEach((egg, idx) => {
        const id = `egg-${idx}`;
        newEggRects[id] = egg.getBoundingClientRect();
      });

      cardRectsRef.current = newCardRects;
      eggRectsRef.current = newEggRects;
      setRectsLoaded(true);
    };

    // Immediate and delayed measurement to ensure layout is stable
    updateCache();
    const timer = setTimeout(updateCache, 150);
    const timer2 = setTimeout(updateCache, 1000); // Late recovery for slow assets
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateCache);
    window.addEventListener('scroll', updateCache, { passive: true });
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateCache);
      window.removeEventListener('scroll', updateCache);
    };
  }, [mounted]);

  useEffect(() => {
    mouseXRef.current = mouseX;
    mouseYRef.current = mouseY;
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    isHoveringRef.current = true;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchUpdate = (e: React.TouchEvent) => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    isHoveringRef.current = true;
    const touch = e.touches[0];
    if (touch) {
      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    // Lingering glow: allow the user to see the discovery for a moment after release
    touchTimeoutRef.current = setTimeout(() => {
      isHoveringRef.current = false;
    }, 500);
  };

  // ATOMIC PHYSICS LOOP: Decoupled from React State for 60fps Realism
  useEffect(() => {
    if (!mounted) return;
    let rafId: number;
    
    const syncPhysics = () => {
      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const mx = mouseXRef.current.get();
        const my = mouseYRef.current.get();
        const isMouseInside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
        const isHovering = isHoveringRef.current && isMouseInside;
        
        // 1. Coordinates
        const rx = mx - rect.left;
        const ry = my - rect.top;

        // Drive global section vars (Atmospheric Background)
        section.style.setProperty('--mouse-x', `${rx}px`);
        section.style.setProperty('--mouse-y', `${ry}px`);
        
        // 2. Optical Constants (Optimized for mobile performance/visibility)
        const R_CLEAN = isMobileRef.current ? 25 : 15;
        const R_GLOW = isMobileRef.current ? 65 : 45;
        const R_FALLOFF = isMobileRef.current ? 120 : 90;

        // 3. Drive Flashlight Cursor
        const flare = flareRef.current;
        if (flare) {
          flare.style.display = isHovering ? 'block' : 'none';
          flare.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
          flare.style.opacity = isHovering ? '1' : '0';
        }

        // JIT Discovery & Cache Recovery (Safety Net)
        if (cardsRef.current.length === 0) {
          cardsRef.current = Array.from(section.querySelectorAll<HTMLElement>('[data-measure]'));
        }
        if (textMasksRef.current.length === 0) {
          textMasksRef.current = Array.from(section.querySelectorAll<HTMLElement>('[data-text-mask]'));
        }
        if (easterEggsRef.current.length === 0) {
          easterEggsRef.current = Array.from(section.querySelectorAll<HTMLElement>('[data-easter-egg]'));
        }

        // Ensure header rect is measured if missing from main cache
        if (!cardRectsRef.current['merch-header']) {
          const header = section.querySelector('[data-measure="merch-header"]');
          if (header) cardRectsRef.current['merch-header'] = header.getBoundingClientRect();
        }

        // 4. Drive Cards (Local Background & Veil Logic)
        cardsRef.current.forEach(cardEl => {
          const id = cardEl.getAttribute('data-measure');
          if (!id) return;
          const vRect = cardRectsRef.current[id];
          if (!vRect) return;

          const lx = mx - vRect.left;
          const ly = my - vRect.top;
          
          const dist = Math.sqrt(Math.pow(lx - vRect.width/2, 2) + Math.pow(ly - vRect.height/2, 2));
          const proximity = Math.max(0, 1 - dist / (R_FALLOFF * 2.5));

          cardEl.style.setProperty('--local-x', `${lx}px`);
          cardEl.style.setProperty('--local-y', `${ly}px`);
          cardEl.style.setProperty('--veil-brightness', `${0.45 + proximity * 0.8}`);

          // Drive attached Veil if present
          const veil = section.querySelector(`[data-veil="${id}"]`) as HTMLElement;
          if (veil) {
            const product = products.find(p => p.id === id);
            const scale = product?.vS || 1;
            
            // Mouse relative to card center
            const dx = (lx - vRect.width / 2) / scale;
            const dy = (ly - vRect.height / 2) / scale;
            
            const r1 = R_CLEAN / scale;
            const r2 = R_GLOW / scale;
            const r3 = R_FALLOFF / scale;

            // Veil is opaque everywhere, hiding the entire card space, but makes a hole where the flashlight is
            const veilMaskStr = `radial-gradient(circle at calc(50% + ${dx}px) calc(50% + ${dy}px), transparent 0%, transparent ${r1}px, rgba(0,0,0,0.8) ${r2}px, black ${r3}px, black 100%)`;
            veil.style.maskImage = veilMaskStr;
            (veil.style as any).webkitMaskImage = veilMaskStr;
            
            // Product is ONLY visible inside the flashlight beam, so anything that peeks out under transparent cloth edges isn't seen
            const prodCont = section.querySelector(`[data-product-mask="${id}"]`) as HTMLElement;
            if (prodCont) {
               const prodMask = `radial-gradient(circle at ${lx}px ${ly}px, black 0%, black ${R_CLEAN + 20}px, transparent ${R_FALLOFF}px, transparent 100%)`;
               prodCont.style.maskImage = prodMask;
               (prodCont.style as any).webkitMaskImage = prodMask;
            }

            const metaLayer = section.querySelector(`[data-metadata-container="${id}"]`) as HTMLElement;
            if (metaLayer) {
              const absDist = Math.sqrt(Math.pow(mx - (vRect.left + vRect.width/2), 2) + Math.pow(my - (vRect.top + vRect.height/2), 2));
              const intensity = Math.max(0, 1 - absDist / (R_FALLOFF * 1.5));
              metaLayer.style.opacity = `${Math.pow(intensity, 2)}`;
              metaLayer.style.pointerEvents = intensity > 0.8 ? 'auto' : 'none';
              
              // Drive the local background mask here too
              const bgMask = section.querySelector(`[data-product-background="${id}"]`) as HTMLElement;
              if (bgMask) {
                const mask = `radial-gradient(circle at ${lx}px ${ly}px, black 0%, black 100px, transparent 220px)`;
                bgMask.style.maskImage = mask;
                (bgMask.style as any).webkitMaskImage = mask;
                bgMask.style.opacity = `${intensity * 0.9}`;
              }
            }
          }
        });

        // 5. Drive Special Masks (Text Ignition)
        textMasksRef.current.forEach(textLayer => {
          const parent = textLayer.closest('[data-measure]') as HTMLElement;
          if (!parent) return;
          
          const id = parent.getAttribute('data-measure');
          let vRect = id ? cardRectsRef.current[id] : undefined;
          
          // Fallback measurement for elements outside product cards (like the section header)
          if (!vRect) vRect = parent.getBoundingClientRect();
          if (!vRect) return;

          const lx = mx - vRect.left;
          const ly = my - vRect.top;
          const maskType = textLayer.getAttribute('data-text-mask');
          
          let r1 = R_CLEAN, r2 = R_GLOW, r3 = R_FALLOFF;
          if (maskType === 'glow') { r1 = R_CLEAN + 20; r2 = R_GLOW; r3 = R_FALLOFF; } 
          else if (maskType === 'clean') { r1 = R_CLEAN/2; r2 = R_CLEAN; r3 = R_GLOW; }
          else if (maskType === 'glow-large') { r1 = R_CLEAN + 60; r2 = R_GLOW + 120; r3 = R_FALLOFF + 300; }
          else if (maskType === 'clean-large') { r1 = R_CLEAN + 30; r2 = R_GLOW + 60; r3 = R_FALLOFF + 150; }

          // Chemical reaction proximity-based opacity for TITLES
          const distToCenter = Math.sqrt(Math.pow(lx - vRect.width/2, 2) + Math.pow(ly - vRect.height/2, 2));
          const revealIntensity = Math.max(0, 1 - distToCenter / (r3 * 1.8));
          textLayer.style.opacity = `${Math.pow(revealIntensity, 1.2)}`;

          const mask = `radial-gradient(circle at ${lx}px ${ly}px, black 0%, black ${r1}px, rgba(0,0,0,0.8) ${r2}px, transparent ${r3}px, transparent 100%)`;
          textLayer.style.maskImage = mask;
          (textLayer.style as any).webkitMaskImage = mask;
        });

        // 6. Easter Egg (Synced Discovery)
        easterEggsRef.current.forEach((egg, idx) => {
          const id = `egg-${idx}`;
          let eRect = eggRectsRef.current[id];
          
          // JIT Cache local recovery
          if (!eRect) {
            eRect = egg.getBoundingClientRect();
            eggRectsRef.current[id] = eRect;
          }

          const dist = Math.sqrt(Math.pow(mx - (eRect.left + eRect.width/2), 2) + Math.pow(my - (eRect.top + eRect.height/2), 2));
          
          const phosphor = egg.querySelector<HTMLElement>('[data-easter-layer="phosphor"]');
          const real = egg.querySelector<HTMLElement>('[data-easter-layer="real"]');
          const toast = egg.querySelector<HTMLElement>('[data-easter-toast]');
          
          const E_RADIUS = R_FALLOFF * 1.8; // More realistic, tighter discovery zone

          if (dist < E_RADIUS) {
            const intensity = Math.max(0, 1 - dist/E_RADIUS);
            const aura = egg.querySelector<HTMLElement>('[data-easter-layer="aura"]');
            
            if (phosphor) {
              phosphor.style.opacity = `${0.2 + intensity * 0.8}`;
              phosphor.style.filter = `brightness(${0.8 + intensity * 1.5}) blur(${2 - intensity * 2}px)`;
            }
            if (real) {
              real.style.opacity = `${Math.pow(intensity, 1.4)}`;
              // Golden Brilliance: High intensity adds a pure white core with a wide golden halo
              real.style.filter = `brightness(${1 + intensity * 0.8}) drop-shadow(0 0 ${20 + intensity * 80}px rgba(255, 191, 0, ${intensity * 0.7})) drop-shadow(0 0 ${10 + intensity * 30}px rgba(255, 255, 255, ${intensity * 0.9}))`;
            }

            if (aura) {
              aura.style.opacity = `${Math.pow(intensity, 2) * 0.8}`;
              aura.style.transform = `translate(-50%, -50%) scale(${1 + intensity * 0.4}) rotate(${intensity * 45}deg)`;
            }
            
            egg.style.transform = `scale(${0.98 + intensity * 0.07})`; // Subtler scale, no rotation
            
            if (toast) {
              toast.style.opacity = `${Math.max(0, (intensity - 0.7) * 3.3)}`;
              toast.style.transform = `translateX(-50%) translateY(${-intensity * 20}px)`;
            }
          } else {
            const aura = egg.querySelector<HTMLElement>('[data-easter-layer="aura"]');
            if (phosphor) {
              phosphor.style.opacity = '0.15';
              phosphor.style.filter = 'brightness(0.6) blur(2px)';
            }
            if (real) {
              real.style.opacity = '0';
              real.style.filter = 'none';
            }
            if (aura) {
              aura.style.opacity = '0';
              aura.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            egg.style.transform = 'scale(0.98)';
            if (toast) toast.style.opacity = '0';
          }
        });
      }
      rafId = requestAnimationFrame(syncPhysics);
    };

    rafId = requestAnimationFrame(syncPhysics);
    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  const handleMeasure = useCallback((id: string, rect: DOMRect) => {
    cardRectsRef.current[id] = rect;
  }, []);

  if (!mounted) return null;

  return (
    <section
      id="section-merch"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
      onTouchStart={handleTouchUpdate}
      onTouchMove={handleTouchUpdate}
      onTouchEnd={handleTouchEnd}
      className="gravity-merch-zone min-h-screen relative flex items-center justify-center bg-black py-[80px] md:py-[120px] overflow-hidden isolate cursor-none touch-none md:touch-pan-y"
    >
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 0%, black 40px, transparent 180px, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), black 0%, black 40px, transparent 180px, transparent 100%)`,
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat'
        } as any}
      >
        <Image 
          src="/assets/Fondo referencia.png" 
          alt="Atmosphere" 
          fill 
          sizes="100vw"
          className="object-cover opacity-80 mix-blend-screen scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 -translate-y-24">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6 relative z-50">
          <div className="text-center relative z-20 mb-8 w-fit mx-auto" data-measure="merch-header">
            {/* Top Label (Dormant + Active) */}
            <div className="relative mb-4">
              <span className="absolute inset-0 label-xs tracking-[0.5em] text-white/5 blur-[1px] block opacity-10">PRIVATE COLLECTION</span>
              <span className="relative label-xs tracking-[0.5em] text-[#888] block opacity-0" data-text-mask="clean-large">PRIVATE COLLECTION</span>
            </div>

            <div className="relative inline-block w-full">
              {/* 1. Dormant Header (Dead Phosphorus - In the Dark) */}
              <h2 className="display-sm text-4xl md:text-6xl font-black uppercase text-transparent opacity-0">MERCH</h2>
              <h2 className="absolute inset-0 display-sm text-4xl md:text-6xl font-black uppercase text-[#0d1a15] blur-[3px] opacity-10 tracking-[0.2em] pointer-events-none">MERCH</h2>
              
              {/* 2. Ignition Header (Chemical Reactivity - Volatile Flare) */}
              <div className="absolute inset-0 z-10 mix-blend-screen pointer-events-none opacity-0" data-text-mask="glow-large">
                <h2 className="display-sm text-4xl md:text-6xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#60ffdb] via-white to-[#60ffdb] tracking-[0.2em] blur-[4px] drop-shadow-[0_0_35px_rgba(96,255,219,0.5)]">MERCH</h2>
              </div>
 
              {/* 3. Crystallized Header (Crystallized Core) */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-0" data-text-mask="clean-large">
                <h2 className="display-sm text-4xl md:text-6xl font-black uppercase text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] brightness-125">MERCH</h2>
              </div>
            </div>
            
            <div className="w-24 h-[1px] bg-white/5 mx-auto mt-6" />
            <div className="absolute left-1/2 w-24 h-[1px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#60ffdb]/60 to-transparent mt-6 mb-6 top-full opacity-0" data-text-mask="glow-large" />
            
            <div className="relative inline-block w-full mt-6">
              {/* Subtitle Dormant (Penumbra) */}
              <p className="text-[10px] tracking-[0.5em] text-transparent opacity-0 uppercase font-black">Archival Collection // Expected Soon</p>
              <p className="absolute inset-0 text-[10px] tracking-[0.5em] text-white/5 uppercase font-black pointer-events-none">Archival Collection // Expected Soon</p>
              
              {/* Subtitle Chemical Ignition */}
              <div className="absolute inset-0 z-10 mix-blend-screen pointer-events-none opacity-0" data-text-mask="glow-large">
                <p className="text-[10px] tracking-[0.5em] text-[#60ffdb] blur-[1px] uppercase font-black drop-shadow-[0_0_15px_rgba(96,255,219,0.4)]">Archival Collection // Expected Soon</p>
              </div>
 
              {/* Subtitle Crystallized */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-0" data-text-mask="clean-large">
                <p className="text-[10px] tracking-[0.5em] text-white/70 uppercase font-black">Archival Collection // Expected Soon</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addItem={addItem} 
              sectionRef={sectionRef} 
              onMeasure={handleMeasure} 
            />
          ))}
        </div>
      </div>

      {/* EASTER EGG: Dilio Action Figure (Relocated to Outer Left Void) */}
      <div 
        data-easter-egg
        className="absolute left-6 md:left-[9%] bottom-[12%] md:bottom-[22%] z-[70] w-28 h-56 md:w-32 md:h-64 pointer-events-auto cursor-none" // Relocated and resized for mobile
        onClick={(e) => {
          e.stopPropagation();
          
          // 1. Eureka moment flash
          if (flashOverlayRef.current) {
            flashOverlayRef.current.style.opacity = '1';
            setTimeout(() => {
              if (flashOverlayRef.current) flashOverlayRef.current.style.opacity = '0';
            }, 150);
          }

          // 2. Unlock logic
          unlockFreeShipping();
          addItem({
            id: 'prod_egg',
            name: 'SUPERSTAR DJ // LIMITED EDITION',
            price: 140,
            image: '/assets/easter_egg_2.png'
          });
        }}
      >
        {/* Layer 0: Aura (Energy Field - Professional Post-Prod) */}
        <div 
          data-easter-layer="aura"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-[60px] pointer-events-none mix-blend-screen opacity-0"
          style={{ 
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 160, 0, 0.1) 40%, transparent 70%)',
          }} 
        />

        {/* Layer 1: Phosphor (Dormant Ghost) */}
        <img 
          data-easter-layer="phosphor"
          src="/assets/easter_egg_1.png" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
          style={{ 
            opacity: 0.15,
            animation: 'phosphor-breath 8s ease-in-out infinite'
          }} 
        />
        <style>{`
          @keyframes phosphor-breath {
            0%, 100% { opacity: 0.10; filter: brightness(0.5) blur(3px); }
            50% { opacity: 0.20; filter: brightness(0.8) blur(1.5px); }
          }
          @keyframes chemical-volatile {
            0%, 100% { filter: blur(5px) brightness(1) saturate(1.5); transform: scale(1); }
            50% { filter: blur(7px) brightness(1.3) saturate(2); transform: scale(1.02); }
            25%, 75% { filter: blur(4px) brightness(1.1) saturate(1.8); transform: scale(0.99); }
          }
          @keyframes shine-sweep {
            0% { transform: translateX(-200%) skewX(-30deg); }
            20%, 100% { transform: translateX(200%) skewX(-30deg); }
          }
          @keyframes diamond-pulse {
            0%, 100% { transform: rotate(45deg) scale(1); opacity: 0.8; }
            50% { transform: rotate(45deg) scale(1.2); opacity: 1; }
          }
        `}</style>

        {/* Layer 2: Hi-Fi Revealed Figure */}
        <img 
          data-easter-layer="real"
          src="/assets/easter_egg_2.png" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none" // Removed transition-opacity duration-300
          style={{ opacity: 0 }}
        />

        {/* Discovery Tooltip/Toast (3D Rounded Crystal + Golden Energy) */}
        <div 
          data-easter-toast
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 pointer-events-none whitespace-nowrap overflow-hidden rounded-full"
          style={{ 
            backdropFilter: 'blur(15px) saturate(2)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 15px rgba(255,191,0,0.2)', // Golden shadow hint
          }}
        >
           <div className="relative bg-gradient-to-br from-white/10 to-transparent text-white/95 px-4 py-1 flex items-center gap-2 border-[0.5px] border-white/30">
             {/* Volumetric Shine (Golden Prism Effect) */}
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent skew-x-[-20deg] -translate-x-[200%]" 
                  style={{ animation: 'shine-sweep 3s ease-in-out infinite' }} />
             
             {/* Micro Sparkle Icon (Brilliant Gold) */}
             <div className="w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_12px_rgba(255,215,0,0.9)]" 
                  style={{ animation: 'diamond-pulse 2s ease-in-out infinite' }} />
             
             <span className="text-[6px] font-black tracking-[0.5em] uppercase flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
               UNLOCKED
             </span>
             
             <div className="w-1 h-1 bg-amber-300 rounded-full shadow-[0_0_12px_rgba(255,215,0,0.9)]" 
                  style={{ animation: 'diamond-pulse 2s ease-in-out infinite' }} />
           </div>
        </div>
      </div>

      {/* 3. VEIL SHROUDS — REMOVED FROM HERE, MOVED INSIDE CARDS FOR OVERLAY */}

      {/* 4. REAL LITE BEAM — Viewport-Locked (Standardized Optics) */}
      <div 
        ref={flareRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[1000] will-change-transform opacity-0 transition-opacity duration-300 overflow-visible"
      >
        {/* Shifting the graphic downward relative to the focal light dot for realism */}
        <div className="relative translate-y-12">
          {/* Main Lens Optical Flare (Realistic focus) */}
          <img 
            src="/assets/linterna cursor.png" 
            alt="" 
            className="w-full h-full object-contain opacity-100 filter brightness-125 contrast-110 mix-blend-screen scale-100"
          />
        </div>
      </div>

      <MerchTutorial />

      {/* 5. CINEMATIC FLASH OVERLAY (Eureka Moment) */}
      <div 
        ref={flashOverlayRef}
        className="fixed inset-0 z-[999] bg-white opacity-0 pointer-events-none transition-opacity duration-500 mix-blend-overlay"
      />
    </section>
  );
}
