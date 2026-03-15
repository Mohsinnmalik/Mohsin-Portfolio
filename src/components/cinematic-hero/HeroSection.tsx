"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene3D } from "./Scene3D";
import { useUIStore } from "@/store/useUIStore";
import { AnimatePresence, motion } from "framer-motion";
import { AIVoiceWidget } from "@/components/ui/AIVoiceWidget";
import { DoodleHint } from "@/components/ui/DoodleHint";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const aiMode = useUIStore((state) => state.aiMode);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when AI mode is active to prevent user from scrolling away from the face
  useEffect(() => {
    if (aiMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [aiMode]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Setup initial state: text hidden and slightly lower
      gsap.set(".hero-text", { 
        opacity: 0, 
        y: 40 
      });

      // The text fading is coordinated with the 3D scroll timeline
      // Text appears near the end of the scroll journey
      gsap.to(".hero-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", // Starts pinning here
          end: "bottom+=200% bottom", // Matches Scene3D scroll end for desktop
          scrub: 1, // Smooth matching
        },
        opacity: 1,
        y: 0,
        ease: "power2.out",
        // Delays effect via keyframes in GSAP for scrubbed animations
        // 0-60% nothing, 60-80% fades in, 80-100% hold
        keyframes: [
          { opacity: 0, y: 40, duration: 0.6 },
          { opacity: 1, y: 0, duration: 0.2 },
          { opacity: 1, y: 0, duration: 0.2 } 
        ]
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-950"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(circle at center, #0f172a 0%, #020617 100%)" }}
      />

      {/* 3D Canvas Container */}
      {/* Fixed via GSAP pinning during scroll */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <Scene3D containerRef={containerRef} />
      </div>

      {/* HTML UI Layer */}
      {/* Container is pointer-events-none so we don't block 3D interactions */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-end pointer-events-none">
        
        <AnimatePresence mode="wait">
          {!isMounted || !aiMode ? (
            /* Right-aligned text block that fades in late in the scroll */
            <>
              <DoodleHint key="doodle-hint" />
              <motion.div 
                key="hero-text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
                className="hero-text w-full md:w-5/12 text-left pointer-events-auto mt-20 md:mt-0"
              >
                <p className="text-emerald-400 font-mono tracking-wider text-sm mb-3 uppercase drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                Full Stack Developer & AI Enthusiast
              </p>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-6">
                Mohsin Malik
                <br />
                <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
                  Hello there!
                </span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-md mb-10">
                Specializing in scalable backend architectures, machine learning integration, and high-performance full-stack applications. Bridging theory with production.
              </p>
              
              <div className="flex flex-wrap gap-5">
                <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm tracking-wide hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 relative overflow-hidden group">
                  <span className="relative z-10">View Projects</span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <button className="px-8 py-3.5 rounded-xl border border-orange-500/50 text-orange-400 font-bold text-sm tracking-wide hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 active:scale-95">
                  Read Resume
                </button>
              </div>
            </motion.div>
            </>
          ) : (
            <motion.div
              key="ai-widget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-5/12 pointer-events-auto flex justify-end"
            >
              {/* Force show AIVoiceWidget and bypass its own animation state wrapper to rely on Framer Motion here */}
              <AIVoiceWidget forceShow={true} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Scroll indicator - fades out on scroll dynamically, and hidden on aiMode */}
      <AnimatePresence>
        {(!isMounted || !aiMode) && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest uppercase flex flex-col items-center gap-3 animate-pulse"
          >
            <span>Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
