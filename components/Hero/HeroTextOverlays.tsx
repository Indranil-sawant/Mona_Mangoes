"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { Outfit } from "next/font/google";
import { useModal } from "../ModalContext";

const outfit800 = Outfit({ weight: "800", subsets: ["latin"] });
const outfit600 = Outfit({ weight: "600", subsets: ["latin"] });
const outfit400 = Outfit({ weight: "400", subsets: ["latin"] });

export default function HeroTextOverlays({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { openModal } = useModal();

  // Corner 1: Top-Left (Headline)
  const op1 = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 0, 0, -60]);

  // Corner 2: Top-Right (Subheadline)
  const op2 = useTransform(scrollYProgress, [0.05, 0.25, 0.85, 1], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.05, 0.25, 0.85, 1], [40, 0, 0, 40]);

  // Corner 3: Bottom-Left (Microcopy)
  const op3 = useTransform(scrollYProgress, [0.15, 0.35, 0.85, 1], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.15, 0.35, 0.85, 1], [60, 0, 0, 60]);

  // Corner 4: Bottom-Right (CTAs)
  const op4 = useTransform(scrollYProgress, [0.25, 0.45, 0.85, 1], [0, 1, 1, 0]);
  const x4 = useTransform(scrollYProgress, [0.25, 0.45, 0.85, 1], [40, 0, 0, 40]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none p-8 md:p-16 lg:p-24 flex flex-col justify-between h-full">
      {/* Upper Layer: Headline and Core Attributes */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-10 mt-28">
        
        {/* Top Left: Headline */}
        <motion.div style={{ opacity: op1, y: y1 }} className="max-w-xl">
          <h1 className={`${outfit800.className} text-white text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter`}>
            Mangoes.<br/>
            <span className="text-[#FFA500]">Reimagined.</span>
          </h1>
        </motion.div>

        {/* Top Right: Subheadline */}
        <motion.div 
          style={{ opacity: op2, x: x2 }} 
          className="max-w-xs md:text-right mt-4 md:mt-2 bg-white/5 p-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
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
          className="max-w-[340px] bg-black/40 p-8 rounded-3xl backdrop-blur-xl border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FFA500] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
          <p className={`${outfit400.className} text-white/70 text-base md:text-lg leading-relaxed italic`}>
            "From Konkan orchards to your table — pure, chemical-free sweetness."
          </p>
        </motion.div>

        {/* Bottom Right: CTAs */}
        <motion.div style={{ opacity: op4, x: x4 }} className="flex flex-col gap-4 pointer-events-auto items-end">
          <button 
            onClick={openModal}
            className={`${outfit600.className} px-12 py-5 bg-[#FFA500] text-black rounded-full hover:bg-[#FFD166] shadow-[0_0_30px_rgba(255,165,0,0.3)] hover:shadow-[0_0_50px_rgba(255,165,0,0.6)] transition-all duration-500 text-center whitespace-nowrap font-bold flex items-center gap-3 group`}
          >
            ORDER NOW <span className="transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
          </button>
          <a href="#farms" className={`${outfit600.className} px-10 py-4 bg-white/5 backdrop-blur-xl text-white rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-500 text-center whitespace-nowrap text-xs uppercase tracking-widest`}>
            Explore Farms
          </a>
        </motion.div>
      </div>
    </div>
  );
}
