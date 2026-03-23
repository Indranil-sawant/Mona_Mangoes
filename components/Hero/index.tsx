"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import HeroCanvas from "./HeroCanvas";
import HeroTextOverlays from "./HeroTextOverlays";
import Navbar from "../Navbar";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll over a 500vh container (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax parallax light leak effect on scroll
  const leakY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <>
      <Navbar />
      
      {/* 500vh section gives the scroll depth for scrollytelling */}
      <div ref={containerRef} className="relative h-[500vh] w-full bg-[#1a1a1a]">
        
        {/* Sticky viewport content */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1a1a1a]">
          
          {/* 1. Cinematic image sequence player */}
          <HeroCanvas scrollYProgress={scrollYProgress} />
          
          {/* 2. Premium corner text system */}
          <HeroTextOverlays scrollYProgress={scrollYProgress} />
          
          {/* 3. Luxury visual enhancements (Grain, Light Leaks) */}
          <div className="grain-overlay" aria-hidden="true" />
          <motion.div 
            style={{ y: leakY }}
            className="light-leak" 
            aria-hidden="true" 
          />
          
          {/* 4. Bottom shadow gradient for scroll-to-content transition */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent pointer-events-none z-10"
            aria-hidden="true"
          />
        </div>
      </div>
      
      {/* Target for scrollytelling completion anchor */}
      <div id="order" className="h-screen w-full bg-[#1a1a1a] flex items-center justify-center border-t border-white/5 relative z-30">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-white text-5xl font-black tracking-tight uppercase">Reserve Your Case</h2>
          <p className="text-white/40 text-sm tracking-widest uppercase">The Summer Harvest starts June 2026</p>
        </div>
      </div>
    </>
  );
}
