"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skills = [
  { name: "React / Next.js", level: "95%" },
  { name: "Node.js & TypeScript", level: "90%" },
  { name: "Python / FastAPI", level: "85%" },
  { name: "Tailwind CSS", level: "95%" },
  { name: "Machine Learning (LLMs)", level: "80%" },
  { name: "Cloud / DevOps", level: "75%" }
];

export function SkillsPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Track from strictly when the container top hits the viewport top
    // to when the container bottom hits the viewport bottom
    offset: ["start start", "end end"]
  });

  // Phase 1: Giant Text sliding in horizontally (0 to 30% scroll)
  const leftTextX = useTransform(scrollYProgress, [0, 0.3], ["-100vw", "0vw"]);
  const rightTextX = useTransform(scrollYProgress, [0, 0.3], ["100vw", "0vw"]);
  
  // Phase 1.5: Giant Text fading out and blurring away (30% to 45% scroll)
  const giantTextOpacity = useTransform(scrollYProgress, [0.3, 0.45], [1, 0]);
  const giantTextScale = useTransform(scrollYProgress, [0.3, 0.45], [1, 1.5]);

  // Phase 2: Skills Grid emerging (45% to 60% scroll)
  const gridOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const gridScale = useTransform(scrollYProgress, [0.45, 0.6], [1.1, 1]);

  // Phase 3: Progress Bars filling up (60% to 90% scroll)
  // We will pass the global scroll progress down to each bar to map their individual fills
  
  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="relative z-20 h-[300vh] bg-[#0a0f1d]"
    >
      {/* Sticky Camera Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0f1d] flex items-center justify-center">
        
        {/* === GIANT TEXT LAYER === */}
        <motion.div 
          style={{ opacity: giantTextOpacity, scale: giantTextScale }}
          className="absolute inset-0 flex items-center justify-center gap-6 md:gap-12 pointer-events-none"
        >
          <motion.h2 
            style={{ x: leftTextX }}
            className="text-[15vw] md:text-[8rem] font-black text-white uppercase tracking-tighter"
          >
            MY
          </motion.h2>
          <motion.h2 
            className="text-[15vw] md:text-[8rem] font-black text-transparent uppercase tracking-tighter"
            style={{ 
              x: rightTextX, 
              WebkitTextStroke: "2px rgba(249, 115, 22, 1)" 
            }}
          >
            SKILLS
          </motion.h2>
        </motion.div>


        {/* === ACTUAL SKILLS LAYER === */}
        <motion.div 
          style={{ opacity: gridOpacity, scale: gridScale }}
          className="container mx-auto px-6 md:px-12 max-w-5xl w-full relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">My Skills</h2>
            <p className="text-slate-400">Technologies and tools I work with to build scalable systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, i) => {
              // Calculate specific bounds for each progress bar to fill staggeringly
              // e.g. first bar fills  0.6 -> 0.65, next fills 0.65 -> 0.70...
              const start = 0.6 + (i * 0.04);
              const end = start + 0.1;
              // Map that slice of overall scroll strictly to the skill's percentage string
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const barWidth = useTransform(scrollYProgress, [start, end], ["0%", skill.level]);

              return (
                <div
                  key={skill.name}
                  className="bg-[#0f1525] p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-white">{skill.name}</span>
                    <span className="text-orange-500 font-mono text-sm">{skill.level}</span>
                  </div>
                  <div className="w-full bg-[#1a2336] h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      style={{ width: barWidth }}
                      className="bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
