"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Outfit } from "next/font/google";
import { useModal } from "../ModalContext";
import { useEffect, useState } from "react";

const outfit800 = Outfit({ weight: "800", subsets: ["latin"] });
const outfit600 = Outfit({ weight: "600", subsets: ["latin"] });
const outfit400 = Outfit({ weight: "400", subsets: ["latin"] });

export default function HeroTextOverlays({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { openModal } = useModal();

  // Typography animations and blurs
  const headerBlur = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], ["blur(0px)", "blur(0px)", "blur(0px)", "blur(10px)"]);
  const letterSpacing = useTransform(scrollYProgress, [0, 0.15], ["-0.05em", "0em"]);
  
  // Corner 1: Top-Left (Headline)
  const op1 = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, -30, -30, -60]);

  // Corner 2: Top-Right (Subheadline)
  const op2 = useTransform(scrollYProgress, [0.05, 0.25, 0.85, 1], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.05, 0.25, 0.85, 1], [40, 0, 0, 40]);

  // Corner 3: Bottom-Left (Microcopy)
  const op3 = useTransform(scrollYProgress, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.15, 0.35, 0.85, 1], [60, 0, 0, 60]);

  // Corner 4: Bottom-Right (CTAs)
  const op4 = useTransform(scrollYProgress, [0.25, 0.45, 0.85, 1], [0, 1, 1, 0]);
  const x4 = useTransform(scrollYProgress, [0.25, 0.45, 0.85, 1], [40, 0, 0, 40]);

  // Floating objects parallax
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const [featureIndex, setFeatureIndex] = useState(0);
  const features = ["Unmatched Quality", "Perfectly Sweet", "Farm to Table"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-8 md:p-16 lg:p-24 flex flex-col justify-between h-full overflow-hidden">
      
      {/* Floating Micro-Badges */}
      <motion.div style={{ y: floatY1, opacity: op2 }} className="absolute top-[25%] left-[60%] hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className={`${outfit600.className} text-white/90 text-xs tracking-widest uppercase`}>Zero Waste</span>
      </motion.div>

      <motion.div style={{ y: floatY2, opacity: op3 }} className="absolute top-[45%] left-[20%] hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
         <div className="w-2 h-2 rounded-full bg-[#FFA500] animate-pulse" />
        <span className={`${outfit600.className} text-white/90 text-xs tracking-widest uppercase`}>Solar Powered</span>
      </motion.div>

      <motion.div style={{ y: floatY3, opacity: op4 }} className="absolute top-[70%] left-[75%] hidden xl:flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className={`${outfit600.className} text-white/90 text-xs tracking-widest uppercase`}>Smart Irrigation</span>
      </motion.div>

      {/* Upper Layer: Headline and Core Attributes */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-10 mt-28 relative">
        
        {/* Top Left: Headline */}
        <motion.div 
          style={{ opacity: op1, y: y1, filter: headerBlur }} 
          className="max-w-xl"
        >
          {/* Blur to sharp entrance */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 30 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", staggerChildren: 0.2 }}
          >
            <motion.h1 
              style={{ letterSpacing }}
              className={`${outfit800.className} text-white text-6xl md:text-7xl lg:text-8xl leading-[0.9] origin-left`}
            >
              Mangoes.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FFD166] drop-shadow-[0_0_15px_rgba(255,165,0,0.4)]">
                Reimagined.
              </span>
            </motion.h1>

            <div className="mt-6 h-8 overflow-hidden relative">
               {features.map((feat, i) => (
                  <motion.p
                    key={feat}
                    className={`${outfit600.className} text-[#FFD166] text-xl tracking-widest uppercase absolute`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: i === featureIndex ? 1 : 0, 
                      y: i === featureIndex ? 0 : -20 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feat}
                  </motion.p>
               ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Top Right: Subheadline */}
        <motion.div 
          style={{ opacity: op2, x: x2 }} 
          className="max-w-xs md:text-right mt-4 md:mt-0 bg-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:bg-white/10 transition-colors duration-500 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <h2 className={`${outfit600.className} text-white/90 text-sm md:text-base leading-relaxed tracking-widest uppercase`}>
            Handpicked Alphonso &middot; Naturally ripened &middot; Farm to home
          </h2>
        </motion.div>
      </div>

      {/* Lower Layer: Narrative and Conversion */}
      <div className="flex flex-col md:flex-row justify-between items-end w-full gap-10 pb-16 md:pb-12">
        
        {/* Bottom Left: Microcopy */}
        <motion.div 
          style={{ opacity: op3, y: y3 }} 
          className="max-w-[340px] bg-black/40 p-8 rounded-3xl backdrop-blur-xl border border-white/5 relative overflow-hidden group hover:border-[#FFA500]/30 transition-colors duration-500"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FFA500] to-[#FFD166] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
          <p className={`${outfit400.className} text-white/70 text-base md:text-lg leading-relaxed italic group-hover:text-white/90 transition-colors`}>
            "From Konkan orchards to your table — pure, chemical-free sweetness."
          </p>
        </motion.div>

        {/* Bottom Right: CTAs */}
        <motion.div style={{ opacity: op4, x: x4 }} className="flex flex-col gap-4 pointer-events-auto items-end">
          <button 
            onClick={openModal}
            className={`${outfit600.className} px-12 py-5 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-black rounded-full shadow-[0_0_30px_rgba(255,165,0,0.4)] hover:shadow-[0_0_60px_rgba(255,165,0,0.8)] transition-all duration-500 text-center whitespace-nowrap font-bold flex items-center gap-3 group relative overflow-hidden hover:scale-105 active:scale-95`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">ORDER NOW</span> 
            <span className="relative z-10 transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
          </button>
          <a href="#farms" className={`${outfit600.className} px-10 py-4 bg-white/5 backdrop-blur-xl text-white rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-500 text-center whitespace-nowrap text-xs uppercase tracking-widest`}>
            Explore Farms
          </a>
        </motion.div>
      </div>
    </div>
  );
}
