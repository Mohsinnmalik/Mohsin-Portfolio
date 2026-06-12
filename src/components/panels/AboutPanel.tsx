"use client";

import SplitText from "../reactbits/SplitText";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ProfileCard from "../reactbits/ProfileCard";
import { useRef } from "react";
import { useMobile } from "@/lib/hooks/useMobile";

export function AboutPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] // Start tracking when top of panel hits bottom of viewport, end when panel is centered
  });

  const xTransformLeft = useTransform(scrollYProgress, [0, 1], [-300, 0]);
  // Right text slides from +300px to 0
  const xTransformRight = useTransform(scrollYProgress, [0, 1], [300, 0]);
  // Opacity fades in along the way
  const opacityTransform = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section 
      id="about" 
      className="py-24 bg-[#0c0d14] text-white relative overflow-hidden border-b-4 border-black z-20"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      {/* Corner frame borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none select-none z-25"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none select-none z-25"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none select-none z-25"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none select-none z-25"></div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <SplitText
            text="About Me"
            className="text-3xl md:text-5xl font-extrabold text-white mb-4 font-display"
            delay={30}
            duration={1}
            ease="power2.out"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 overflow-x-hidden px-4 md:px-0">
          
          <motion.div 
            style={{ x: isMobile ? 0 : xTransformLeft, opacity: opacityTransform }}
            className="w-full md:w-1/2 flex justify-center mt-0 md:mt-0 relative h-[420px] md:h-[450px] lg:h-[540px]"
          >
            <ProfileCard
              name="Mohsin Malik"
              title="Full Stack Engineer"
              handle="mohsinnmalik"
              status="Online"
              contactText="Hire Me"
              avatarUrl="/images/about-avatar.jpg"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowColor="#7c3aed"
              behindGlowSize="20%"
              behindGlowEnabled={true}
              miniAvatarUrl="/images/about-avatar.jpg"
              onContactClick={() => {
                const contact = document.getElementById("contact");
                if (contact) contact.scrollIntoView({ behavior: "smooth" });
              }}
              innerGradient="linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(124, 58, 237, 0.2) 100%)"
              className="w-full h-full max-w-sm lg:max-w-md mx-auto"
            />
          </motion.div>

          {/* Right: Content & Stats */}
          <motion.div 
            style={{ x: isMobile ? 0 : xTransformRight, opacity: opacityTransform }}
            className="w-full md:w-1/2"
          >
            <div className="text-base md:text-lg text-slate-300 leading-relaxed mb-8">
              <span>Hi, I&apos;m <span className="text-white font-extrabold underline decoration-[#7c3aed] decoration-2">Mohsin Malik</span>. 
              I don&apos;t just build products; I build digital experiences that matter. 
              My obsession with creation began with a simple question: 
              <span className="italic font-bold text-black bg-[#ffe600] px-1.5 py-0.5 border border-black inline-block">&quot;How can I make this more impactful?&quot;</span> 
              Today, as the <span className="text-white font-extrabold">Co-Founder of CodeFlux</span>, 
              I focus on turning complex ideas into intelligent, production-ready web platforms 
              that solve real problems for real people. 
              For me, technology is about more than code—it&apos;s about 
              <span className="font-extrabold text-[#7c3aed]">growth through execution</span> and constant innovation.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 select-none">
              <div className="text-center md:text-left brutal-card p-6 !bg-slate-900/60 !text-white hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#7c3aed] transition-all">
                <h4 className="text-4xl lg:text-5xl font-extrabold !text-white mb-1 font-display">5+</h4>
                <div className="text-slate-400 text-[10px] font-bold font-mono uppercase tracking-wider leading-tight">Production<br/>Projects</div>
              </div>
              <div className="text-center md:text-left brutal-card p-6 !bg-[#ffe600] !text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all">
                <h4 className="text-4xl lg:text-5xl font-extrabold !text-black mb-1 font-display">7+</h4>
                <div className="text-slate-900 text-[10px] font-bold font-mono uppercase tracking-wider leading-tight">Tech Workshops<br/>Conducted</div>
              </div>
              <div className="text-center md:text-left brutal-card p-6 !bg-[#00f0ff] !text-black hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] transition-all">
                <h4 className="text-4xl lg:text-5xl font-extrabold !text-black mb-1 font-display">15K+</h4>
                <div className="text-slate-900 text-[10px] font-bold font-mono uppercase tracking-wider leading-tight">Revenue<br/>Generated</div>
              </div>
            </div>

            <button 
              onClick={() => {
                const contact = document.getElementById("contact");
                if (contact) contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="brutal-btn px-8 py-4 bg-[#7c3aed] text-white hover:bg-[#6d28d9] w-fit shrink-0"
            >
              Contact Me
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
