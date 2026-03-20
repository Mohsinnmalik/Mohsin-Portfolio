"use client";

import SplitText from "../reactbits/SplitText";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import ProfileCard from "../reactbits/ProfileCard";
import { useRef } from "react";

export function AboutPanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] // Start tracking when top of panel hits bottom of viewport, end when panel is centered
  });

  // Left card slides from -300px to 0 as scroll progresses from 0 to 1
  const xTransformLeft = useTransform(scrollYProgress, [0, 1], [-300, 0]);
  // Right text slides from +300px to 0
  const xTransformRight = useTransform(scrollYProgress, [0, 1], [300, 0]);
  // Opacity fades in along the way
  const opacityTransform = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section 
      id="about" 
      className="py-24 bg-[#0B1121] text-slate-300 relative overflow-hidden z-20"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <SplitText
            text="About Me"
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            delay={30}
            duration={1}
            ease="power2.out"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 overflow-x-hidden px-4 md:px-0">
          
          <motion.div 
            style={{ x: xTransformLeft, opacity: opacityTransform }}
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
              behindGlowColor="#f97316"
              behindGlowSize="25%"
              behindGlowEnabled={false}
              miniAvatarUrl="/images/about-avatar.jpg"
              onContactClick={() => window.location.href = "#contact"}
              innerGradient="linear-gradient(145deg, rgba(8, 11, 22, 0.8) 0%, rgba(249, 115, 22, 0.1) 100%)"
              className="w-full h-full max-w-sm lg:max-w-md mx-auto"
            />
          </motion.div>

          {/* Right: Content & Stats */}
          <motion.div 
            style={{ x: xTransformRight, opacity: opacityTransform }}
            className="w-full md:w-1/2"
          >
            <div className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
              Hi, I&apos;m <span className="text-white font-bold">Mohsin Malik</span>. 
              I don&apos;t just build products; I build digital experiences that matter. 
              My obsession with creation began with a simple question: 
              <span className="italic text-slate-300">&quot;How can I make this more impactful?&quot;</span> 
              Today, as the <span className="text-orange-400 font-bold">Co-Founder of CodeFlux</span>, 
              I focus on turning complex ideas into intelligent, production-ready web platforms 
              that solve real problems for real people. 
              For me, technology is about more than code—it&apos;s about 
              <span className="text-slate-200">growth through execution</span> and constant innovation.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2"><span>5+</span></h4>
                <div className="text-slate-400 text-sm uppercase tracking-wider"><span>Production<br/>Projects</span></div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2"><span>7+</span></h4>
                <div className="text-slate-400 text-sm uppercase tracking-wider"><span>Tech Workshops<br/>Conducted</span></div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2"><span>15K+</span></h4>
                <div className="text-slate-400 text-sm uppercase tracking-wider"><span>Revenue<br/>Generated</span></div>
              </div>
            </div>

            <button 
              onClick={() => {
                const contact = document.getElementById("contact");
                if (contact) contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-full border border-orange-500/50 text-white font-medium hover:bg-orange-500 transition-colors duration-300 w-fit shrink-0"
            >
              Contact Me
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
