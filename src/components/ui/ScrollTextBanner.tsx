"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./ScrollTextBanner.css";

export function ScrollTextBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Track from when the top of the container hits the top of the viewport
    // Until the bottom of the container hits the bottom of the viewport
    offset: ["start start", "end end"]
  });

  // Calculate translation range - from off-screen right to off-screen left
  // To ensure the text moves completely across the screen during the pinned scroll
  const xTransform = useTransform(scrollYProgress, [0, 1], ["100vw", "-200vw"]);
  
  // Opposite direction layer covering the same immense distance
  const xTransformOpposite = useTransform(scrollYProgress, [0, 1], ["-200vw", "100vw"]);

  return (
    <section 
      ref={containerRef} 
      // The outer container dictates the "scroll length" - how long the user must scroll to finish the animation
      className="relative z-20 h-[300vh] bg-[#0a0f1d]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center gap-8 overflow-hidden border-y border-white/5 bg-[#0a0f1d]">
        <motion.div style={{ x: xTransformOpposite }} className="whitespace-nowrap flex w-max">
          <h2 className="stb-text stb-stroke">
            IN MY FREE TIME, ALL I THINK ABOUT IS TECH!
          </h2>
          <span className="stb-separator" />
          <h2 className="stb-text stb-stroke">
            IN MY FREE TIME, ALL I THINK ABOUT IS TECH!
          </h2>
        </motion.div>

        <motion.div style={{ x: xTransform }} className="whitespace-nowrap flex w-max">
          <h2 className="stb-text stb-fill text-orange-500">
            IN MY FREE TIME, ALL I THINK ABOUT IS TECH!
          </h2>
          <span className="stb-separator bg-orange-500" />
          <h2 className="stb-text stb-fill text-orange-500">
            IN MY FREE TIME, ALL I THINK ABOUT IS TECH!
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
