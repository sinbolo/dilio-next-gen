"use client";

import { useCart } from "@/lib/CartContext";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalPrice, shipping, isFreeShipping } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-surface-container-lowest shadow-2xl z-[2101] flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-surface">
              <h2 className="display-sm text-xl tracking-widest">CART</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Close Cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {isFreeShipping && (
                <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-[0_0_20px_rgba(153,255,239,0.15)] animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secret Discovery Unlocked</span>
                  </div>
                  <h4 className="text-xl font-black text-white italic tracking-tighter">FREE SHIPPING APPLIED</h4>
                  <p className="text-[9px] text-primary/70 uppercase tracking-[0.2em] font-bold">Collector Exclusive Benefit</p>
                </div>
              )}

              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <div className="w-16 h-16 border border-current rounded-full flex items-center justify-center">
                    <span className="text-2xl font-display">0</span>
                  </div>
                  <p className="label-sm tracking-widest">YOUR CART IS EMPTY</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-surface-container-low p-3 rounded-xl border border-white/5">
                    <div className="w-20 h-20 bg-black/50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="max-w-[80%] max-h-[80%] object-contain" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="label-sm font-bold truncate">{item.name}</h3>
                      <p className="body-sm opacity-70 mb-2">{item.price.toFixed(2)} €</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-black/30 rounded-full px-3 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="opacity-70 hover:opacity-100">
                            <Minus size={14} />
                          </button>
                          <span className="label-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="opacity-70 hover:opacity-100">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-error opacity-70 hover:opacity-100 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-surface flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center label-xs opacity-50 tracking-wider">
                    <span>SUBTOTAL</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center label-xs tracking-wider">
                    <span className="opacity-50">SHIPPING</span>
                    {isFreeShipping ? (
                      <span className="text-primary font-bold flex items-center gap-2">
                        FREE <span className="text-[8px] bg-primary/20 px-1 rounded uppercase tracking-[0.2em]">SECRET UNLOCKED</span>
                      </span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="opacity-50">13.00 €</span>
                        <span className="text-[7px] opacity-30 mt-0.5 tracking-wider">*MAY VARY DEPENDING ON THE AREA</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center font-display tracking-wider pt-2 border-t border-white/5">
                  <span className="opacity-70 font-bold">TOTAL</span>
                  <span className="text-xl font-bold">{(totalPrice + shipping).toFixed(2)} €</span>
                </div>
                
                <button className="w-full py-4 bg-on-surface text-surface label-md font-bold hover:opacity-90 transition-opacity rounded-sm mt-2">
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
