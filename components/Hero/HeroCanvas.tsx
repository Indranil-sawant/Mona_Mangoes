"use client";

import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useMotionValueEvent, useTransform } from "framer-motion";

interface HeroCanvasProps {
  scrollYProgress: MotionValue<number>;
}

// Filenames in public/images: ezgif-frame-001.jpg ... ezgif-frame-240.jpg
const FRAME_COUNT = 240;
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

  // Subtle zoom-in effect on scroll
  const scaleValue = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

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
          setLoaded(true); // All frames loaded
        }
      };
      
      images.push(img);
    }
    
    imagesRef.current = images;
    
    const handleResize = () => {
      drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, currentFrame.current)));
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const drawFrame = (frameFloat: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    
    const frame1 = Math.floor(frameFloat);
    const frame2 = Math.min(FRAME_COUNT - 1, Math.ceil(frameFloat));
    const fraction = frameFloat - frame1;

    const img1 = imagesRef.current[frame1];
    const img2 = imagesRef.current[frame2];
    
    if (!img1 || !img1.complete || img1.naturalWidth === 0) return;
    
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
    const scale1 = Math.max(rect.width / img1.width, rect.height / img1.height);
    const x1 = (rect.width - img1.width * scale1) / 2;
    const y1 = (rect.height - img1.height * scale1) / 2;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    // Base tropical warm grading overlay background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalAlpha = 1;
    ctx.drawImage(img1, x1, y1, img1.width * scale1, img1.height * scale1);

    // Cross-fade with next frame
    if (img2 && img2.complete && frame1 !== frame2) {
        const scale2 = Math.max(rect.width / img2.width, rect.height / img2.height);
        const x2 = (rect.width - img2.width * scale2) / 2;
        const y2 = (rect.height - img2.height * scale2) / 2;
        ctx.globalAlpha = fraction;
        ctx.drawImage(img2, x2, y2, img2.width * scale2, img2.height * scale2);
    }

    ctx.globalAlpha = 1;

    // Darker edges overlay (Premium vignette)
    const px = rect.width / 2;
    const py = rect.height / 2;
    const gradientRadius = Math.max(rect.width, rect.height) * 0.7;
    const vignette = ctx.createRadialGradient(px, py, 0, px, py, gradientRadius);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.7, "rgba(0,0,0,0.2)");
    vignette.addColorStop(1, "rgba(0,0,0,0.8)");
    
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, rect.width, rect.height);

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
      // Smoother lower LERP coefficient for motion blur feel
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.08;
      
      const frameFloat = Math.max(0, Math.min(FRAME_COUNT - 1, currentFrame.current));
      drawFrame(frameFloat);
      
      rafId.current = requestAnimationFrame(renderLoop);
    };
    
    renderLoop();
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover z-0 hero-canvas transition-opacity duration-1500 ${loaded ? "opacity-100" : "opacity-80"}`}
      style={{ scale: scaleValue, backgroundColor: "#1a1a1a" }}
      aria-label="360 degree panoramic view of the MONA mango orchard harvest"
    />
  );
}
