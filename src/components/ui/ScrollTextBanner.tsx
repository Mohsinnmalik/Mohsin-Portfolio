"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Sub-component to handle 3D perspective transforms per text phase
function CinematicText3D({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: any;
  range: [number, number];
}) {
  const [start, end] = range;
  
  // Normalized 3D mappings within the active scroll range
  // z: moves from deep space (-1000px) to camera view (0px) and flies past the lens (+1000px)
  const z = useTransform(progress, [start, start + 0.12, end - 0.12, end], [-1000, 0, 0, 1000]);
  
  // rotateX: tilts back initially, flattens out, and tilts forward as it exits
  const rotateX = useTransform(progress, [start, start + 0.12, end - 0.12, end], [60, 0, 0, -45]);
  
  // opacity & blur: fades in and sharpens up, then blurs and fades away
  const opacity = useTransform(progress, [start, start + 0.08, end - 0.12, end - 0.03], [0, 1, 1, 0]);
  const blurVal = useTransform(progress, [start, start + 0.08, end - 0.12, end - 0.03], [20, 0, 0, 20]);
  const blur = useTransform(blurVal, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{
        z,
        rotateX,
        opacity,
        filter: blur,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
    >
      {children}
    </motion.div>
  );
}

export function ScrollTextBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Theme transitions seamlessly from Cyan -> Purple -> White
  const themeColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 0.7, 1],
    ["#00f0ff", "#00f0ff", "#7c3aed", "#7c3aed", "#ffffff", "#ffffff"]
  );

  const styleVariables = {
    "--theme-color": themeColor,
  } as React.CSSProperties;

  return (
    <section
      ref={containerRef}
      className="relative z-20 h-[300vh] bg-black border-y-4 border-black animate-fadeIn"
      style={styleVariables}
      suppressHydrationWarning
    >
      {/* Sticky viewport wrapper with 3D perspective enabled */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-[#0a0b10] overflow-hidden"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        
        {/* Subtle 3D Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293706_1px,transparent_1px),linear-gradient(to_bottom,#1f293706_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        
        {/* Cinematic Nebular Drifting Glow Spheres */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-25">
          <div 
            className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full filter blur-[120px] animate-pulse transition-colors duration-1000"
            style={{
              background: "radial-gradient(circle, var(--theme-color) 0%, transparent 70%)",
              animationDuration: "8s"
            }}
          />
          <div 
            className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full filter blur-[120px] animate-pulse transition-colors duration-1000"
            style={{
              background: "radial-gradient(circle, var(--theme-color) 0%, transparent 70%)",
              animationDuration: "12s",
              animationDelay: "2s"
            }}
          />
        </div>

        {/* 3D Depth guide lines (gives reference points as you fly past) */}
        <div className="absolute top-0 bottom-0 left-[15%] w-[1px] bg-white/5 hidden md:block" />
        <div className="absolute top-0 bottom-0 right-[15%] w-[1px] bg-white/5 hidden md:block" />

        {/* Text Container with preserve-3d */}
        <div 
          className="relative w-full max-w-5xl h-[50vh]"
          style={{ transformStyle: "preserve-3d" }}
        >
          
          {/* Phase 1 Text */}
          <CinematicText3D progress={scrollYProgress} range={[0.0, 0.33]}>
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-[#00f0ff] mb-4 font-bold opacity-60">
              01 // ARCHITECT
            </span>
            <h2 
              className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-display text-center leading-none text-white transition-all duration-300"
              style={{
                textShadow: "0 0 40px rgba(0, 240, 255, 0.4)",
              }}
            >
              I BUILD <br /> INTELLIGENT PRODUCTS
            </h2>
          </CinematicText3D>

          {/* Phase 2 Text */}
          <CinematicText3D progress={scrollYProgress} range={[0.33, 0.66]}>
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-[#7c3aed] mb-4 font-bold opacity-60">
              02 // OBSESSION
            </span>
            <h2 
              className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-display text-center leading-none text-white transition-all duration-300"
              style={{
                textShadow: "0 0 40px rgba(124, 58, 237, 0.4)",
              }}
            >
              OBSESSED WITH <br /> CREATION
            </h2>
          </CinematicText3D>

          {/* Phase 3 Text */}
          <CinematicText3D progress={scrollYProgress} range={[0.66, 1.0]}>
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/50 mb-4 font-bold opacity-60">
              03 // LEGACY
            </span>
            <h2 
              className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase font-display text-center leading-none text-white transition-all duration-300"
              style={{
                textShadow: "0 0 40px rgba(255, 255, 255, 0.25)",
              }}
            >
              SINCE DAY ONE
            </h2>
          </CinematicText3D>

        </div>

      </div>
    </section>
  );
}
