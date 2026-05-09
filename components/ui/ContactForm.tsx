"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

const DISPOSABLE_DOMAINS = [
  "temp-mail.org", "guerrillamail.com", "10minutemail.com", "yopmail.com",
  "mailinator.com", "guerrillamail.org", "guerrillamail.net", "guerrillamail.biz",
  "sharklasers.com", "grr.la", "guerrillamailblock.com", "dispostable.com",
  "getairmail.com", "moakt.com", "tempmail.net", "emailondeck.com"
];

const WHITELIST_DOMAINS = [
  "gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com"
];

const contactSchema = z.object({
  email: z.string().email().refine((email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return !DISPOSABLE_DOMAINS.includes(domain);
  }, {
    message: "Please use a professional or permanent personal email address to continue",
  }),
  message: z.string().min(10).max(500),
});

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmailRealTime = (email: string) => {
    if (!email) {
      setEmailError("");
      return;
    }
    const parts = email.split("@");
    if (parts.length < 2) return; // Wait for full email
    
    const domain = parts[1].toLowerCase();
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      setEmailError("Please use a professional or permanent personal email address to continue");
    } else {
      setEmailError("");
    }
  };

  useEffect(() => {
    validateEmailRealTime(emailValue);
  }, [emailValue]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Honeypot check
    const formData = new FormData(e.currentTarget);
    const honeypot = formData.get("website_honey");
    if (honeypot) {
      // It's a bot. Silently pretend it worked.
      setStatus("success");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const data = {
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // Client-side validation
      contactSchema.parse(data);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded. Try again later.");
        throw new Error("Failed to send message.");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setEmailValue("");
    } catch (err: any) {
      setStatus("error");
      const zodError = err.errors?.[0]?.message;
      setErrorMsg(zodError || err.message || "An error occurred.");
    }
  };

  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const placeholders = [
    "I'm interested in booking for my next event...",
    "Hello Dilio, we'd love to have you at...",
    "Looking to collaborate on a new project...",
    "Inquiry regarding availability for tour dates...",
    "Professional booking request for..."
  ];

  useEffect(() => {
    const currentFullText = placeholders[placeholderIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(currentFullText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);

        if (charIndex + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholder(currentFullText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);

        if (charIndex === 1) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Honeypot Field */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input 
          type="text" 
          name="website_honey" 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="label-xs">EMAIL ADDRESS</label>
        <input 
          name="email"
          type="email" 
          required 
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          className={`no-box-input py-3 w-full ${emailError ? "error" : ""}`} 
          placeholder="your@email.com"
        />
        {emailError && <p className="text-red-500 text-[0.7rem] font-bold mt-1 uppercase tracking-wider">{emailError}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label className="label-xs">ADDITIONAL INFORMATION</label>
        <textarea 
          name="message"
          required 
          rows={4}
          className="no-box-input py-3 w-full resize-none placeholder:italic placeholder:opacity-50" 
          placeholder={placeholder}
        />
        <style jsx>{`
          textarea::placeholder {
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
      
      <AnimatePresence>
        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 text-black text-center p-8 rounded-lg"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-display tracking-[0.2em] mb-4 uppercase"
            >
              INQUIRY RECEIVED
            </motion.h3>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-8 max-w-[280px] leading-loose"
            >
              Our management team will review your request with the highest priority. A confirmation email has been dispatched to your inbox.
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setStatus("idle")}
              className="text-[10px] tracking-[0.4em] uppercase border-b border-black py-1 hover:opacity-50 transition-opacity"
            >
              CLOSE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        type="submit" 
        disabled={status === "loading" || !!emailError}
        className="bg-primary text-on-primary py-4 px-8 label-md w-full mt-4 hover:bg-black/80 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "SENDING..." : "SUBMIT"}
      </button>
    </form>
  );
}
