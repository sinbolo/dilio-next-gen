"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface NotifyBannerProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
}

export function NotifyBanner({ isOpen, onClose, city }: NotifyBannerProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions due to browser background refresh
    const lastSubmitted = localStorage.getItem("dilio_subscribe_last_submitted");
    if (lastSubmitted) {
      const timeSince = Date.now() - parseInt(lastSubmitted, 10);
      if (timeSince < 12 * 60 * 60 * 1000) { // 12 hours
        setStatus("success");
        setTimeout(() => {
          onClose();
          setTimeout(() => setStatus("idle"), 500);
        }, 3000);
        return;
      }
    }

    setStatus("submitting");
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      
      localStorage.setItem("dilio_subscribe_last_submitted", Date.now().toString());
      setStatus("success");
      setEmail("");
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        onClose();
        setTimeout(() => setStatus("idle"), 500);
      }, 3000);
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/20 backdrop-blur-md z-[2100] cursor-pointer"
          />
          
          {/* Banner Container */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:bottom-12 md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-black text-white p-8 md:rounded-2xl z-[2101] shadow-2xl overflow-hidden"
          >
            {/* Background Grain/Texture (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/assets/noise.png')] bg-repeat" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[#22c55e] font-display text-xs tracking-[0.4em] font-bold mb-2">NOTIFY ME</h3>
                  <h2 className="display-xs text-2xl tracking-tighter uppercase">{city} THE SESSIONS</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {status !== "success" ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="text-white/50 text-[10px] md:text-xs tracking-[0.1em] uppercase font-mono">
                    DROP YOUR EMAIL TO RECEIVE EXCLUSIVE ACCESS TO PRE-ORDER TICKETS FOR THIS DESTINATION.
                  </p>
                  <div className="relative group">
                    <input 
                      type="email"
                      required
                      placeholder="YOUR@EMAIL.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toUpperCase())}
                      className="w-full bg-white/5 border-b border-white/20 py-4 px-0 text-xs md:text-sm tracking-[0.2em] focus:outline-none focus:border-[#22c55e] transition-colors placeholder:text-white/20 uppercase"
                    />
                    <button 
                      type="submit"
                      disabled={status === "submitting"}
                      className="absolute right-0 bottom-3 text-white/40 hover:text-[#22c55e] transition-colors disabled:opacity-50"
                    >
                      {status === "submitting" ? (
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Send size={18} />
                        </motion.div>
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full border border-[#22c55e]/30 flex items-center justify-center mb-8 relative"
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-[#22c55e]/5"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  
                  <motion.h4 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[#22c55e] font-display text-base tracking-[0.4em] font-bold mb-3 uppercase"
                  >
                    ACCESO CONCEDIDO
                  </motion.h4>

                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-mono max-w-[280px] leading-relaxed mb-2"
                  >
                    Has sido añadido a nuestro círculo exclusivo. Recibirás acceso prioritario en breve.
                  </motion.p>

                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "30px" }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="h-px bg-[#22c55e]/20 my-3"
                  />

                  <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/25 text-[8px] uppercase tracking-[0.2em] font-mono max-w-[280px] leading-relaxed"
                  >
                    You have been added to our elite circle. Expect exclusive intelligence shortly.
                  </motion.p>

                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "40px" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-[1px] bg-[#22c55e]/30 mt-8"
                  />
                </motion.div>
              )}
            </div>
            
            {/* Visual Decorative Line */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
