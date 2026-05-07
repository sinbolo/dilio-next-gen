"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PremiumBookingTitleProps {
  text: string;
}

export function PremiumBookingTitle({ text }: PremiumBookingTitleProps) {
  const characters = text.split("");

  return (
    <div className="relative py-4 overflow-hidden">
      <motion.h2 
        className="display-sm mb-6 uppercase flex flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ perspective: "1200px" }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 60,
                rotateX: -90,
                scale: 0.8,
                filter: "blur(20px)",
              },
              visible: { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  duration: 1.2,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }
              }
            }}
            whileHover={{ 
              scale: 1.1,
              y: -5,
              textShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
              transition: { duration: 0.2 }
            }}
            className="inline-block relative mr-[0.15em] cursor-default"
            style={{ letterSpacing: "0.2em" }}
          >
            {char === " " ? "\u00A0" : char}
            
            <motion.span
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: [0, 0.4, 0],
                  scale: [0.8, 1.4, 1],
                  transition: {
                    duration: 2,
                    delay: (index * 0.06) + 0.6,
                    ease: "easeInOut",
                  }
                }
              }}
              className="absolute inset-0 text-[#22c55e] blur-[20px] pointer-events-none select-none z-[-1]"
            >
              {char}
            </motion.span>
          </motion.span>
        ))}
      </motion.h2>

      {/* Beam and Particles with pointer-events-none */}
      <motion.div
        initial={{ x: "-150%", skewX: -45, opacity: 0 }}
        whileInView={{ x: "250%", skewX: -45, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 2.5, 
          delay: 0.4,
          ease: [0.43, 0.13, 0.23, 0.96] 
        }}
        className="absolute top-0 h-full w-24 bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent pointer-events-none z-10 blur-xl"
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, x: i * 30 }}
          whileInView={{ 
            opacity: [0, 1, 0],
            y: [-20, -60],
            x: (i * 30) + (Math.random() * 20 - 10)
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: 1 + (i * 0.2),
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute bottom-10 w-1 h-1 bg-[#22c55e] rounded-full blur-[1px] pointer-events-none"
        />
      ))}
    </div>
  );
}
