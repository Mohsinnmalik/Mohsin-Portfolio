"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Hero() {
  const prefersReduced = useReducedMotion();

  // PERF FIX: Replaced filter:blur with scale+opacity — GPU composited, no layout reflow
  return (
    <section className="h-screen flex items-center justify-center relative pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-4xl pointer-events-auto"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-sm font-medium text-neutral-300 tracking-wide uppercase">AI Systems Architect</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
            Engineering <span className="italic font-light opacity-90">Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            I architect and deploy scalable machine learning solutions, solving complex real-world problems through advanced AI and robust backend infrastructure.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
