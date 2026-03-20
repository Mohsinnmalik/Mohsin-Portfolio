"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./ScrollTextBanner.css";

export function ScrollTextBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Travel range calculated to ensure long text clears screen even on small viewports
  const xTransform = useTransform(scrollYProgress, [0, 1], ["100vw", "-600vw"]);
  const xTransformOpposite = useTransform(scrollYProgress, [0, 1], ["-600vw", "100vw"]);

  return (
    <section
      ref={containerRef}
      // h-[500vh] on mobile (sm:h-[300vh] on desktop) — mobile needs more scroll room
      // because the massive font travels slowly per px of scroll
      className="relative z-20 h-[500vh] sm:h-[300vh] bg-[#0a0f1d]"
      style={{ position: 'relative' }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center gap-8 overflow-hidden border-y border-white/5 bg-[#0a0f1d]">

        <motion.div style={{ x: xTransformOpposite }} className="whitespace-nowrap flex w-max">
          <h2 className="stb-text stb-stroke">
            I BUILD INTELLIGENT PRODUCTS — OBSESSED WITH CREATION DAY 1!
          </h2>
          <span className="stb-separator" />
          <h2 className="stb-text stb-stroke">
            I BUILD INTELLIGENT PRODUCTS — OBSESSED WITH CREATION DAY 1!
          </h2>
        </motion.div>

        <motion.div style={{ x: xTransform }} className="whitespace-nowrap flex w-max">
          <h2 className="stb-text stb-fill text-orange-500">
            I BUILD INTELLIGENT PRODUCTS — OBSESSED WITH CREATION DAY 1!
          </h2>
          <span className="stb-separator bg-orange-500" />
          <h2 className="stb-text stb-fill text-orange-500">
            I BUILD INTELLIGENT PRODUCTS — OBSESSED WITH CREATION DAY 1!
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
