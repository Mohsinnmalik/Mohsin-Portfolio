"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const skills = [
  { name: "React / Next.js", level: "88%" },
  { name: "Node.js / Express", level: "82%" },
  { name: "JavaScript (Core)", level: "85%" },
  { name: "Python (AI / Automation / Backend)", level: "78%" },
  { name: "AI / ML Integration (LLMs, APIs, Automation)", level: "80%" },
  { name: "MongoDB / Database Design", level: "76%" }
];

// Horizontal scrolling logos component
function TechLogoCarousel() {
  const logos = [
    "React", "Next.js", "Node.js", "Express", "JavaScript", "Python", 
    "PyTorch", "OpenAI", "MongoDB", "PostgreSQL", "TailwindCSS", "TypeScript",
    "Framer Motion", "GSAP", "Docker", "AWS", "GitHub", "Vercel"
  ];
  
  // Double the logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="mt-20 w-full overflow-hidden relative py-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
      {/* Gradient masks for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0f1d] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0f1d] to-transparent z-10" />
      
      <motion.div 
        className="flex gap-16 items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {duplicatedLogos.map((logo, i) => (
          <div key={i} className="text-xl md:text-2xl font-black tracking-tighter text-white/20 hover:text-orange-500/80 transition-colors whitespace-nowrap cursor-default uppercase">
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

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
      style={{ position: 'relative' }}
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
            <div className="text-slate-400">Technologies and tools I work with to build scalable systems.</div>
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

          {/* Tech Stack Logo Carousel — Moving horizontally below the grid */}
          <TechLogoCarousel />
        </motion.div>

      </div>
    </section>
  );
}
