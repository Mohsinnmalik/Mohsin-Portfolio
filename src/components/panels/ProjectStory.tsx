"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  MotionValue
} from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import RippleImageReveal from '../ui/RippleImageReveal';
import { ClientOnly } from '../ui/ClientOnly';

interface Project {
  id: string;
  subheading: string;
  headline: string;
  image: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
}

const PROJECTS: Project[] = [
  {
    id: "codeflux",
    subheading: "EdTech Startup",
    headline: "CODEFLUX",
    image: "/images/showcase/codeflux.png",
    description: "Redesigning education with AI-driven insights and interactive deep-learning curriculums for the next generation.",
    tech: ["Next.js", "TypeScript", "OpenAI"],
    link: "#",
    github: "#"
  },
  {
    id: "vyapar-chat",
    subheading: "AI for MSMEs",
    headline: "VYAPAR-CHAT",
    image: "/images/showcase/vyapar.png",
    description: "Intelligent chat interfaces automating sales, support, and business management for small businesses.",
    tech: ["FastAPI", "React", "PostgreSQL"],
    link: "#",
    github: "#"
  },
  {
    id: "dochub",
    subheading: "Resource Platform",
    headline: "ANJUMAN DOC HUB",
    image: "/images/showcase/dochub.png",
    description: "A centralized hub for rapid knowledge dispersal and document lifecycle management at scale.",
    tech: ["Prisma", "AWS", "Node.js"],
    link: "#",
    github: "#"
  },
  {
    id: "nexus",
    subheading: "Data Insights",
    headline: "NEXUS AI",
    image: "/images/showcase/nexus.png",
    description: "High-end analytics with real-time predictive modeling and 3D data visualization for enterprise scale.",
    tech: ["Three.js", "D3.js", "Firebase"],
    link: "#",
    github: "#"
  },
  {
    id: "flux-studio",
    subheading: "Design Collective",
    headline: "FLUX STUDIO",
    image: "/images/showcase/flux.png",
    description: "Digital canvas blending minimalist architecture with immersive interactive portfolios and live collaboration.",
    tech: ["GSAP", "Vercel", "Stripe"],
    link: "#",
    github: "#"
  }
];

function ProgressBar({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0.3, 1], ["0%", "100%"]);
  return (
    <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
      <motion.div
        style={{ width, backgroundColor: "#f97316" }}
        className="absolute top-0 left-0 h-full"
      />
    </div>
  );
}

export function ProjectStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  // Transforms for the "Story Start" heading
  const headingOpacity = useTransform(smoothProgress, [0, 0.08, 0.18, 0.25], [0, 1, 1, 0]);
  const headingScale  = useTransform(smoothProgress, [0, 0.18, 0.25], [0.8, 1, 1.4]);
  const headingBlur   = useTransform(smoothProgress, [0.18, 0.25], [0, 20]);

  // Transforms for the actual showcase cards
  const showcaseOpacity = useTransform(smoothProgress, [0.22, 0.3, 0.95, 1], [0, 1, 1, 0]);
  const showcaseY       = useTransform(smoothProgress, [0.22, 0.3], [100, 0]);

  // Update active project index based on scroll
  useEffect(() => {
    const unsub = smoothProgress.on("change", (v) => {
      if (v < 0.3) {
        setActiveIndex(0);
        return;
      }
      const rel = (v - 0.3) / 0.7;
      const idx = Math.min(Math.floor(rel * PROJECTS.length), PROJECTS.length - 1);
      setActiveIndex(idx);
    });
    return unsub;
  }, [smoothProgress]);

  if (!isMounted) {
    return <div className="h-screen bg-black" />;
  }

  const activeItem = PROJECTS[activeIndex];

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full h-[600vh] bg-[#0a0f1d]"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* PHASE 1: Story Heading */}
        <motion.div
          style={{
            opacity: headingOpacity,
            scale: headingScale,
            filter: `blur(${headingBlur}px)` as any
          }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none"
        >
          <span className="text-orange-500 font-mono text-[11px] tracking-[0.5em] uppercase mb-6 font-black block">
            PORTFOLIO
          </span>
          <h2 className="text-[13vw] md:text-[11vw] font-black text-white tracking-tighter leading-none">
            My Projects
          </h2>
        </motion.div>

        {/* PHASE 2: Project Showcase with Ripple Background */}
        <motion.div
          style={{ opacity: showcaseOpacity, y: showcaseY }}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 md:px-16"
        >
          {/* BACKGROUND: The powerful Ripple WebGL component */}
          <div className="absolute inset-0 z-0 opacity-40 md:opacity-50">
            <ClientOnly>
              <RippleImageReveal 
                activeImage={activeItem.image} 
                onNext={() => {}} // Disabled click-to-next as scroll controls it
              />
            </ClientOnly>
          </div>

          {/* VIGNETTE for readability */}
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#0a0f1d_90%)]" />

          {/* FRONT: Project Details Card */}
          <div className="relative z-10 w-full max-w-4xl mx-auto pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center"
              >
                <motion.span className="text-orange-500 font-mono text-[11px] tracking-[0.4em] uppercase mb-5 font-black">
                  {activeItem.subheading}
                </motion.span>

                <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
                  {activeItem.headline}
                </h3>

                <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-light">
                  {activeItem.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {activeItem.tech.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/70 tracking-widest uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-5 pointer-events-auto">
                  <a
                    href={activeItem.link}
                    className="flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/30 group active:scale-95"
                  >
                    View Project
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href={activeItem.github}
                    className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-orange-500/60 transition-all"
                  >
                    <Github size={20} />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DOTS & BAR Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-[min(320px,80vw)]">
            <div className="flex gap-2 justify-center">
              {PROJECTS.map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full transition-all duration-500 bg-white/20"
                  style={{
                    width: i === activeIndex ? '2.5rem' : '0.6rem',
                    backgroundColor: i === activeIndex ? '#f97316' : undefined
                  }}
                />
              ))}
            </div>
            <ProgressBar progress={smoothProgress} />
          </div>
        </motion.div>

        {/* Global edge Vignette */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_70%_70%_at_center,_transparent_0%,_#0a0f1d_100%)] opacity-60" />
      </div>
    </section>
  );
}

export default ProjectStory;
