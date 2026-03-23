"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export function EnquiryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Close on ESC key (as requested in Step 6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate STEP 7 - Google Sheets / API integration
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      
      console.log("Submitting enquiry to MONA API:", data);
      
      // Artificial delay to show premium substate
      await new Promise(r => setTimeout(r, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay (Step 6: Closes on click) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-xl bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.8)] ${outfit.className}`}
          >
            {/* Top Mango Glow Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FFA500] via-[#FFD166] to-[#FFA500]" />
            
            <div className="p-10 md:p-14">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-white text-3xl font-black tracking-tight mb-2 uppercase italic">Reserve Your Case</h3>
                  <p className="text-white/40 text-sm tracking-widest uppercase">Harvesting starts June 15, 2026</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-[#FFA500] hover:border-transparent transition-all"
                >
                  &times;
                </button>
              </div>

              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-[#FFA500]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#FFA500]/40">
                    <span className="text-[#FFA500] text-3xl">✓</span>
                  </div>
                  <h4 className="text-white text-2xl font-bold mb-4">You're on the list.</h4>
                  <p className="text-white/40 max-w-sm mx-auto">We'll notify you 48 hours before the first pick of the season hits the basket.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-[#FFA500]/60 font-bold ml-1">Full Name</label>
                      <input 
                        required 
                        name="name"
                        autoComplete="name"
                        placeholder="John Doe" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-[#FFA500]/60 font-bold ml-1">Email Address</label>
                      <input 
                        required 
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="john@mona.co" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:border-[#FFA500] focus:ring-1 focus:ring-[#FFA500] transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#FFA500]/60 font-bold ml-1">Quantity (approx cases)</label>
                    <select 
                      name="quantity"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none focus:border-[#FFA500] transition-all outline-none"
                    >
                      <option className="bg-[#1a1a1a]" value="1-5">1-5 Premium Cases</option>
                      <option className="bg-[#1a1a1a]" value="6-10">6-10 Special Reserve</option>
                      <option className="bg-[#1a1a1a]" value="bulk">Bulk / Corporate Gifting</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-[#FFA500]/60 font-bold ml-1">Collection Preference</label>
                    <div className="flex gap-4">
                      {["Delivery", "Farm Pick-up"].map(opt => (
                        <label key={opt} className="flex-1 cursor-pointer">
                          <input type="radio" name="collection" value={opt} className="peer hidden" defaultChecked={opt === "Delivery"} />
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center peer-checked:border-[#FFA500] peer-checked:bg-[#FFA500]/5 text-white/40 peer-checked:text-white transition-all text-sm font-medium">
                            {opt}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#FFA500] to-[#FFD166] py-5 rounded-2xl text-black font-black uppercase tracking-widest text-sm hover:translate-y-[-2px] active:translate-y-[0px] transition-all shadow-xl hover:shadow-[#FFA500]/30 disabled:opacity-50"
                  >
                    {isSubmitting ? "Securing slot..." : "Confirm Enquiry →"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
