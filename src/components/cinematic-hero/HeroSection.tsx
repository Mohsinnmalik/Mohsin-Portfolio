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

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-slate-950"
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
          filter: prefersReduced ? undefined : heroFilter,
          transformOrigin: 'center center',
          willChange: 'transform, filter',
          transform: 'translateZ(0)',
        }}
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
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-end md:items-center justify-center md:justify-end pb-24 md:pb-0 pointer-events-none" suppressHydrationWarning>
        
        <AnimatePresence mode="wait">
          {!isMounted || !aiMode ? (
            /* Right-aligned text block that fades in late in the scroll */
            <motion.div key="hero-ui-main" className="contents">
              {/* DoodleHint lives inside Model.tsx (3D Html portal) — not duplicated here */}
              <motion.div 
                key="hero-text"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
                className="hero-text w-full md:w-6/12 text-center md:text-left pointer-events-none"
              >
                <div className="text-orange-500 font-mono tracking-[0.2em] text-[10px] md:text-xs mb-4 uppercase font-bold drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] pointer-events-auto inline-block">
                  <span>FULL STACK ENGINEER • AI PRODUCT BUILDER • STARTUP FOUNDER</span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 pointer-events-auto inline-block">
                  <span>Mohsin Malik</span>
                </h1>
                
                <h2 className="text-xl md:text-3xl font-medium text-slate-200 mb-6 flex flex-col md:flex-row md:items-center gap-2 pointer-events-auto inline-flex">
                  <span>Hi, I&apos;m Mohsin Malik.</span>
                  <span className="text-slate-400"><span>I build real-world web products.</span></span>
                </h2>
                
                <div className="text-slate-400 text-sm md:text-base font-light leading-relaxed max-w-lg mb-8 pointer-events-auto mx-auto md:mx-0">
                  <span>Full Stack Developer focused on building <span className="text-slate-200"><span>scalable SaaS platforms</span></span>, 
                  <span className="text-slate-200"><span> AI-integrated applications</span></span>, and <span className="text-slate-200"><span>high-performance web systems</span></span>. 
                  I turn ideas into production-ready products used by real users.</span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-10 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Built 5+ production web apps</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>Conducted nationwide AI workshops</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span>Founder @ CodeFlux</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 justify-center md:justify-start pointer-events-auto">
                  <button 
                    onClick={() => {
                        const projects = document.getElementById("projects");
                        if (projects) projects.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm tracking-wide hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:scale-95 active:translate-y-0 relative overflow-hidden group">
                    <span className="relative z-10">View Projects</span>
                    <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </button>
                  <button 
                    onClick={() => setIsResumeOpen(true)}
                    className="px-8 py-3.5 rounded-xl border border-orange-500/50 text-orange-400 font-bold text-sm tracking-wide hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-300 active:scale-95"
                  >
                    Read Resume
                  </button>
                  <button 
                    onClick={() => useUIStore.getState().setAiMode(true)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-blue-500/50 text-blue-400 font-bold text-sm tracking-wide hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 active:scale-95 bg-blue-500/5 backdrop-blur-sm"
                  >
                    <Mic size={16} />
                    Talk to AI
                  </button>
                </div>
            </motion.div>
            </motion.div>
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
              <ClientOnly>
                <AIVoiceWidget forceShow={true} />
              </ClientOnly>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* End of scale+blur wrapper — scroll indicator is outside so it stays crisp */}
      </motion.div>

      {/* Scroll indicator - fades out on scroll dynamically, and hidden on aiMode */}
      <AnimatePresence>
        {(!isMounted || !aiMode) && (
            <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-widest uppercase flex flex-col items-center gap-3 animate-pulse">
              <span className="flex flex-col items-center gap-3">
                <span><span>Scroll</span></span>
                <span className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
              </span>
            </div>
        )}
      </AnimatePresence>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
}
