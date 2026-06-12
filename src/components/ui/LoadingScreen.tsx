"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

export function LoadingScreen() {
  const modelLoaded = useUIStore((state) => state.modelLoaded);
  const [isLoaded, setIsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Simulate a highly polished boot sequence log
  useEffect(() => {
    const logs = [
      "LOADING SYSTEM VECTORS...",
      "COMPILING WEBGL SHADERS...",
      "UPLOADING TEXTURES TO GPU...",
      "ESTABLISHING AI WORKFLOW...",
      "SYSTEM DEPLOYED SUCCESSFULLY!"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBootLogs((prev) => [...prev, `> ${log}`]);
      }, index * 300);
    });

    // Simulate smooth percentage progress
    const interval = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        return prev + 1;
      });
    }, 15);

    // Minimum visual display timer (1.5s)
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);

    // Fail-safe timeout (6.5s max) to prevent user lockout
    const failSafeTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(minTimer);
      clearTimeout(failSafeTimer);
    };
  }, []);

  // Set as fully loaded once 3D model returns success signal and minimum display time has passed
  useEffect(() => {
    if (modelLoaded && minTimeElapsed) {
      setDisplayPercent(100);
      const dismissTimeout = setTimeout(() => setIsLoaded(true), 400);
      return () => clearTimeout(dismissTimeout);
    }
  }, [modelLoaded, minTimeElapsed]);

  // Lock body scroll while loading is active
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0b10] pointer-events-auto"
        >
          {/* Subtle Cyber Grid Background */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.15]"
            style={{ 
              backgroundImage: "radial-gradient(#7c3aed 1.5px, transparent 1.5px)", 
              backgroundSize: "24px 24px"
            }}
          />

          {/* Diagnostic Console Box */}
          <motion.div 
            initial={{ scale: 0.9, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative z-10 brutal-card p-6 bg-[#0c0d14] text-white max-w-md w-[90vw] shadow-[8px_8px_0px_#7c3aed] border-4 border-black rotate-[-1deg] hover:rotate-0 transition-transform select-none"
          >
            {/* Console Header Bar */}
            <div className="bg-[#7c3aed] text-white px-4 py-1.5 border-b-4 border-black -mx-6 -mt-6 mb-6 flex items-center justify-between font-mono text-[10px] font-bold">
              <span>SYSTEM_BOOT.BAT</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>LOAD</span>
              </span>
            </div>

            {/* Huge display progress percent */}
            <div className="flex items-baseline justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-[#00f0ff] font-bold uppercase tracking-widest">
                  MOHSIN_CORE_v2.0 // DEPLOY_INIT
                </span>
                <span className="font-display font-black text-3xl tracking-tight mt-1 text-white">
                  Loading Assets
                </span>
              </div>
              <div className="font-display font-black text-6xl text-transparent leading-none" style={{ WebkitTextStroke: "2px #00f0ff" }}>
                {displayPercent}%
              </div>
            </div>

            {/* Diagnostic Logs Screen */}
            <div className="w-full h-24 bg-[#05070f] border-3 border-black p-3 font-mono text-[9px] text-[#2ee59d]/80 overflow-y-auto mb-5 space-y-1 select-none">
              {bootLogs.map((log, i) => (
                <div key={i} className="leading-none">
                  {log}
                </div>
              ))}
              {displayPercent < 100 && (
                <div className="w-1.5 h-3 bg-[#2ee59d] animate-pulse inline-block" />
              )}
            </div>

            {/* Brutalist Chunky Loading progress bar */}
            <div className="w-full h-6 bg-[#1a1c29] border-3 border-black rounded-none overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#00f0ff] border-r-3 border-black"
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
