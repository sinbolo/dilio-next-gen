"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to subscribe");
      
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-2">
          <label className="label-xs text-[#888] mb-1">NOTIFICATIONS // EARLY ACCESS</label>
          <div className="relative flex items-center border-b border-white/10 focus-within:border-white/40 transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@EMAIL.COM"
              required
              className="bg-transparent py-3 text-[10px] tracking-[0.2em] uppercase outline-none w-full text-white placeholder:text-white/20"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="ml-4 label-xs text-white hover:text-[#60ffdb] transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "JOIN"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full mt-2 text-[8px] tracking-[0.2em] text-[#60ffdb] uppercase font-bold"
            >
              WELCOME TO THE LIST
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full mt-2 text-[8px] tracking-[0.2em] text-red-500 uppercase font-bold"
            >
              ERROR. TRY AGAIN.
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
