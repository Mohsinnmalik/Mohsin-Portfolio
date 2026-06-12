"use client";

import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene3D } from "./Scene3D";
import { useUIStore } from "@/store/useUIStore";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Mic } from "lucide-react";
import { AIVoiceWidget } from "@/components/ui/AIVoiceWidget";

import { ResumeModal } from "@/components/ui/ResumeModal";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const aiMode = useUIStore((state) => state.aiMode);
  const [isMounted, setIsMounted] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  // Scroll-driven cinematic exit — only activates in the very last portion of hero scroll
  // Keeps the hero fully clear and enjoyable until you're really leaving
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  // Veil: soft darkening, only last 12% of scroll
  const veilOpacity = useTransform(heroScrollProgress, [0.88, 1], [0, 0.4]);
  // Scale: barely noticeable push — 1.0 → 1.03, starts at 80%
  const heroScale   = useTransform(heroScrollProgress, [0.80, 1], [1, 1.03]);
  // Blur: subtle, max 5px, only last 15%
  const heroBlur    = useTransform(heroScrollProgress, [0.85, 1], [0, 5]);
  const heroFilter  = useTransform(heroBlur, (v) => `blur(${v}px)`);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when AI mode is active to prevent user from scrolling away from the face
  // BUG-18 FIX: Setting overflow:'auto' conflicts with Lenis (it needs overflow unset, not 'auto').
  // Use empty string to REMOVE the inline style when exiting AI mode — Lenis takes control again.
  useEffect(() => {
    if (aiMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // ← unsets the inline style; Lenis resumes
    }
    return () => {
      document.body.style.overflow = ""; // cleanup on unmount
    };
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      containerRef.current.style.setProperty('--mouse-x', `${x}%`);
      containerRef.current.style.setProperty('--mouse-y', `${y}%`);
      
      if (coordsRef.current) {
        coordsRef.current.innerText = `X: ${Math.round(e.clientX)}px | Y: ${Math.round(e.clientY)}px`;
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 flex flex-col justify-between border-b-4 border-black ${
        aiMode ? "bg-[#05070f]" : "bg-[#0a0b10]"
      }`}
    >
      {/* Cinematic Exit Transition — scale + blur + fade-to-black as user scrolls away */}
      {/* The whole scene scales up and blurs (depth-of-field pull) then goes dark */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30 bg-black"
        style={{ opacity: veilOpacity }}
        aria-hidden="true"
      />
      {/* Scale + blur wrapper — will-change pre-applied so GPU layer is promoted before animation starts */}
      {/* PERF FIX: will-change set in inline style BEFORE motion applies filter, satisfying GPU promotion rule */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          scale: prefersReduced ? 1 : heroScale,
          filter: prefersReduced ? "none" : heroFilter,
          willChange: 'transform, filter',
          transform: 'translateZ(0)',
        }}
      >
          {/* Corner frame borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none select-none z-25"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none select-none z-25"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none select-none z-25"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none select-none z-25"></div>

          {/* Corner crosshair indicators for technical blueprint design */}
          <div className="absolute top-4 left-4 font-mono text-xs text-[#7c3aed]/40 pointer-events-none select-none z-25 font-bold">+</div>
          <div className="absolute top-4 right-4 font-mono text-xs text-[#00f0ff]/40 pointer-events-none select-none z-25 font-bold">+</div>
          <div className="absolute bottom-4 left-4 font-mono text-xs text-[#00f0ff]/40 pointer-events-none select-none z-25 font-bold">+</div>
          <div className="absolute bottom-4 right-4 font-mono text-xs text-[#7c3aed]/40 pointer-events-none select-none z-25 font-bold">+</div>

          {/* Grid Coordinates display in bottom left corner */}
          <div className="absolute bottom-6 left-6 font-mono text-[9px] md:text-xs border border-white/10 bg-[#0c0d14]/60 text-white/60 px-2.5 py-1.5 backdrop-blur-sm pointer-events-none select-none z-25 tracking-wider shadow-[2px_2px_0px_#7c3aed]">
            <span ref={coordsRef}>X: --px | Y: --px</span>
          </div>

        {/* Background Pattern: Retro dot grid */}
        <div 
          className="absolute inset-0 z-0 transition-all duration-1000"
          style={{ 
            backgroundImage: aiMode 
              ? "radial-gradient(rgba(0, 240, 255, 0.2) 1.5px, transparent 1.5px)" 
              : "radial-gradient(rgba(124, 58, 237, 0.2) 1.5px, transparent 1.5px)", 
            backgroundSize: "24px 24px",
            opacity: 0.35
          }}
        />

        {/* Interactive Spotlight Radial Glow */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-500"
          style={{
            background: aiMode
              ? "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 240, 255, 0.15) 0%, transparent 60%)"
              : "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.15) 0%, transparent 60%)",
          }}
        />

      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <Scene3D containerRef={containerRef} />
      </div>

      {/* Floating Technical Dashboard Widgets (Desktop Only) */}
      <div
        className="absolute inset-0 pointer-events-none z-20 hidden md:block"
        style={{
          opacity: aiMode ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        {/* System Active Tag */}
        <div className="absolute top-8 left-8 border border-white/10 bg-[#0c0d14]/80 backdrop-blur-md px-4 py-2 flex items-center gap-3 shadow-[4px_4px_0px_#7c3aed]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-mono text-[9px] md:text-[10px] font-bold text-white/90 uppercase tracking-wider">{"AI_SYS: STANDBY"}</span>
        </div>
      </div>

        {/* HTML UI Layer */}
        <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-end md:items-center justify-center md:justify-end pb-32 md:pb-0 pointer-events-none" suppressHydrationWarning>
          <div 
            className="hero-text-anim w-full md:w-5/12 text-left pointer-events-auto flex flex-col gap-5 md:gap-6"
            style={{
              opacity: (!isMounted || !aiMode) ? 1 : 0,
              pointerEvents: (!isMounted || !aiMode) ? "auto" : "none",
              transition: "opacity 0.4s ease-in-out",
            }}
          >
                {/* Interactive Category Badges */}
                <div className="flex flex-wrap gap-2 md:gap-3 pointer-events-auto select-none">
                  <span className="px-3 py-1.5 border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] font-mono tracking-widest text-[#ffe600] uppercase shadow-[2px_2px_0px_rgba(255,230,0,0.5)]">
                    {"FULL STACK ENGINEER"}
                  </span>
                  <span className="px-3 py-1.5 border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase shadow-[2px_2px_0px_rgba(0,240,255,0.5)]">
                    {"AI PRODUCT BUILDER"}
                  </span>
                </div>

                {/* Heading Group */}
                <div className="select-none flex flex-col">
                  <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] font-display tracking-tight">
                    {"Mohsin "}<br/>
                    <span className="text-transparent" style={{ WebkitTextStroke: "2.5px #7c3aed" }}>{"Malik"}</span>
                  </h1>
                  
                  <h2 className="text-base md:text-lg font-bold text-[#00f0ff] mt-3 flex items-center gap-1.5 font-mono">
                    <span>{"Co-Founder @ CodeFlux"}</span>
                  </h2>
                </div>
                
                {/* Narrative Brutalist Card */}
                <div className="brutal-card p-5 md:p-6 bg-[#0c0d14] text-white border-3 border-black shadow-[6px_6px_0px_#7c3aed] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#00f0ff] transition-all duration-300">
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
                    {"Full Stack Developer focused on building "}<span className="underline decoration-[#7c3aed] decoration-2 font-semibold">{"scalable SaaS platforms"}</span>{""}
                    <span className="underline decoration-[#00f0ff] decoration-2 font-semibold">{" AI-integrated applications"}</span>{" and "}<span className="underline decoration-[#ffe600] decoration-2 font-semibold">{"high-performance web systems"}</span>{"."}
                    {" I turn ideas into production-ready products used by real users."}
                  </p>
                </div>

                {/* Call-to-actions */}
                <div className="flex flex-wrap gap-3 mt-2">
                  <button 
                    onClick={() => {
                      const projects = document.getElementById("projects");
                      if (projects) projects.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="brutal-btn px-5 py-3 bg-[#ffe600] text-black text-xs md:text-sm hover:bg-[#ebd400] hover:shadow-[4px_4px_0px_#7c3aed]">
                    {"View Projects"}
                  </button>
                  <button 
                    onClick={() => setIsResumeOpen(true)}
                    className="brutal-btn px-5 py-3 bg-[#0c0d14] text-white border-2 border-black shadow-[4px_4px_0px_#7c3aed] hover:bg-[#151722] hover:shadow-[4px_4px_0px_#00f0ff] text-xs md:text-sm"
                  >
                    {"Read Resume"}
                  </button>
                  <button 
                    onClick={() => useUIStore.getState().setAiMode(true)}
                    className="brutal-btn px-5 py-3 bg-[#00f0ff] text-black text-xs md:text-sm flex items-center gap-1.5 hover:bg-[#00dded] shadow-[4px_4px_0px_#7c3aed]"
                  >
                    <Mic size={14} />
                    {"Talk to AI"}
                  </button>
                </div>
          </div>
        </div>
          {/* Scroll indicator - fades out on scroll dynamically, and hidden on aiMode */}
          <div
            className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest uppercase flex flex-col items-center gap-3 animate-pulse"
            style={{
              opacity: (!isMounted || !aiMode) ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              pointerEvents: "none",
            }}
          >
            <span className="flex flex-col items-center gap-3">
              <span><span>{"Scroll"}</span></span>
              <span className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
            </span>
          </div>
      </motion.div>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
}
