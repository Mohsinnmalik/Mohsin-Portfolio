"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// BUG-23 FIX: LoadingScreen was the only user of isLoaded in the Zustand store.
// Migrated to local state — no other component needs to observe this loading state.
export function LoadingScreen() {
  const { progress } = useProgress();
  // Use local state instead of global store
  const [isLoaded, setIsLoaded] = useState(false);
  // Add an intentional minimum load time so the animation always shows
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500); // 1.5s minimum screen time
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only dismiss if assets are loaded AND min time passed
    if (progress === 100 && minTimeElapsed) {
      // Small delay extra for smooth transition
      const timeout = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, minTimeElapsed]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617] text-white"
        >
          <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
            <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(5, progress)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-emerald-400 font-mono text-xs md:text-sm tracking-widest uppercase flex items-center justify-between w-full">
              <span>Initializing Core</span>
              <span>{Math.round(progress)}%</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
