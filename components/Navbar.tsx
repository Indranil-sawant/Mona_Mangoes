"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Outfit } from "next/font/google";
import { useModal } from "./ModalContext";

const outfit = Outfit({ subsets: ["latin"] });

export default function Navbar() {
  const { openModal } = useModal();
  const { scrollY } = useScroll();
  
  // Transition between transparent and blurred navy background based on scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.6]);
  const blurValue = useTransform(scrollY, [0, 80], [0, 20]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.1]);

  const backgroundColor = useMotionTemplate`rgba(26, 26, 26, ${bgOpacity})`;
  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;

  return (
    <motion.nav
      style={{ 
        backgroundColor, 
        backdropFilter, 
        borderColor, 
        borderBottomWidth: "1px",
        borderBottomStyle: "solid"
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-16 lg:px-24 transition-all duration-300"
    >
      <div className={`${outfit.className} text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FFD166] tracking-widest cursor-pointer uppercase`}>
        MONA
      </div>
      
      <div className="flex items-center gap-10">
        <a href="#farms" className={`${outfit.className} text-white/70 hover:text-[#FFA500] font-medium transition-colors hidden md:block text-xs uppercase tracking-[0.2em]`}>
          Our Orchards
        </a>
        <a href="#process" className={`${outfit.className} text-white/70 hover:text-[#FFA500] font-medium transition-colors hidden md:block text-xs uppercase tracking-[0.2em]`}>
          The Harvest
        </a>
        <button 
          onClick={openModal}
          className={`${outfit.className} relative overflow-hidden px-8 py-2.5 bg-gradient-to-r from-[#FFA500] to-[#FFD166] text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,165,0,0.2)] hover:shadow-[0_0_40px_rgba(255,165,0,0.5)] text-xs font-bold uppercase tracking-widest group`}
        >
          {/* Light Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10">Order Now</span>
        </button>
      </div>
    </motion.nav>
  );
}
