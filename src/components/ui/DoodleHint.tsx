"use client";

import { motion } from "framer-motion";
import { Caveat } from "next/font/google";
import { useUIStore } from "@/store/useUIStore";

const caveat = Caveat({ subsets: ["latin"], weight: ["700"] });

export function DoodleHint() {
  const setAiMode = useUIStore((state) => state.setAiMode);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.1, transition: { duration: 0.2 } }}
      transition={{ duration: 1.2, delay: 1, type: "spring", bounce: 0.5 }}
      onClick={() => setAiMode(true)}
      className="absolute top-[15%] right-[5%] md:right-[25%] z-30 pointer-events-auto cursor-pointer flex flex-col items-center w-[250px]"
    >
      {/* Floating Sparkle/Star */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute -top-6 -left-8 text-orange-400 text-2xl"
      >
        ✦
      </motion.div>

      {/* Aesthetic Text */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className={`${caveat.className} text-orange-400 text-2xl md:text-3xl font-bold tracking-wider rotate-[10deg] drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]`}
      >
        <span>psst... hold me for 5s!</span>
      </motion.div>
      
      {/* Chaotic Scribble Arrow */}
      <motion.svg
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        width="140"
        height="140"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-1 -rotate-[15deg] translate-x-12 opacity-90 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]"
      >
        {/* Multiple chaotic strokes for a messy "drawn" feel */}
        <path
          d="M 20 10 Q 50 15, 80 40 T 35 90"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 22 12 Q 48 18, 77 42 T 38 88"
          stroke="#fb923c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrowhead */}
        <path
          d="M 35 90 L 55 80 M 35 90 L 40 65"
          stroke="#f97316"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 37 88 L 53 82 M 37 88 L 42 67"
          stroke="#fb923c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
      
      {/* Decorative dots */}
      <motion.div className="flex gap-2 absolute bottom-0 right-0 translate-x-full">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
            className="w-1.5 h-1.5 bg-orange-400 rounded-full drop-shadow-[0_0_3px_rgba(249,115,22,0.8)]"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
