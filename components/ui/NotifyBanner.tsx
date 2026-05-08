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
    setStatus("submitting");
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center mb-4">
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  </div>
                  <h4 className="text-[#22c55e] font-display text-sm tracking-[0.3em] font-bold mb-1 uppercase">REQUEST RECEIVED</h4>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">YOU WILL BE THE FIRST TO KNOW.</p>
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
