"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dilio_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dilio_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("dilio_cookie_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary text-on-primary z-[3000] border-t border-outline-variant/20 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
      <div className="max-w-2xl">
        <h3 className="display-xs mb-2">PRIVACY & COOKIES</h3>
        <p className="body-md text-on-primary/70 mb-0">
          We use strictly necessary cookies to make our site work. We'd also like to set optional cookies to help us improve it. 
          We won't set optional cookies unless you enable them. Using this tool will set a cookie on your device to remember your preferences.
        </p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <button 
          onClick={handleReject}
          className="flex-1 md:flex-none uppercase label-md bg-transparent text-on-primary border border-on-primary/20 py-3 px-6 hover:bg-on-primary/10 transition-colors"
        >
          REJECT NON-ESSENTIAL
        </button>
        <button 
          onClick={handleAccept}
          className="flex-1 md:flex-none uppercase label-md bg-on-primary text-primary py-3 px-6 hover:bg-white transition-colors"
        >
          ACCEPT ALL
        </button>
      </div>
    </div>
  );
}
