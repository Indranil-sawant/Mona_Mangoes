"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface HeroCanvasProps {
  scrollYProgress: MotionValue<number>;
}

// Filenames in public/images: ezgif-frame-001.jpg ... ezgif-frame-144.jpg
const FRAME_COUNT = 144;
const FRAME_PATH = "/images/ezgif-frame-";
const FRAME_EXT = ".jpg";

export default function HeroCanvas({ scrollYProgress }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cross-fade frame logic using manual LERP for ultimate smoothness
  const targetFrame = useRef(0);
  const currentFrame = useRef(0);
  const rafId = useRef<number | null>(null);

  // Preload frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedImages = 0;
    
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `${FRAME_PATH}${paddedIndex}${FRAME_EXT}`;
      
      img.onload = () => {
        loadedImages++;
        
        // Show something immediately
        if (loadedImages === 1 && i === 1) {
          drawFrame(0);
        }
        
        if (loadedImages === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      
      images.push(img);
    }
    
    imagesRef.current = images;
    
    const handleResize = () => {
      drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentFrame.current))));
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }
    
    // Cover math
    const scale = Math.max(rect.width / img.width, rect.height / img.height);
    const x = (rect.width - img.width * scale) / 2;
    const y = (rect.height - img.height * scale) / 2;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // Tropical warm grading overlay (very subtle cinematic effect)
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // Warmth filter overlay
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = "rgba(255, 165, 0, 0.05)";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.globalCompositeOperation = 'source-over';
  };

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    targetFrame.current = latest * (FRAME_COUNT - 1);
  });

  useEffect(() => {
    const renderLoop = () => {
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.1;
      
      const frameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentFrame.current)));
      drawFrame(frameIndex);
      
      rafId.current = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover z-0 hero-canvas transition-opacity duration-1500 ${loaded ? "opacity-100" : "opacity-80"}`}
      role="img"
      aria-label="360 degree panoramic view of the MONA mango orchard harvest"
      style={{ backgroundColor: "#1a1a1a" }}
    />
  );
}
