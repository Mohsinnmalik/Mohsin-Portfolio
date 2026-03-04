'use client';

import React, { useRef } from 'react';
import SplitText from '../reactbits/SplitText';
import FadeContent from '../reactbits/FadeContent';
import StarBorder from '../reactbits/StarBorder';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 1,
    role: 'Senior Frontend Developer',
    company: 'Tech Innovators Inc.',
    period: '2022 - Present',
    description: 'Lead the frontend development of an enterprise SaaS platform. Architected the main UI component library and mentored junior developers.'
  },
  {
    id: 2,
    role: 'UI/UX Developer',
    company: 'Creative Studio',
    period: '2020 - 2022',
    description: 'Designed and built interactive web experiences for high-profile clients. Focused on GSAP animations, 3D Canvas rendering, and Next.js performance optimization.'
  },
  {
    id: 3,
    role: 'Frontend Engineer',
    company: 'Startup Hub',
    period: '2018 - 2020',
    description: 'Developed scalable React applications from the ground up. Collaborated closely with the design team to ensure pixel-perfect implementation.'
  }
];

export default function ExperiencePanel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAnimationComplete = () => {
    // console.log('Timeline text animation complete');
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-32 px-4 sm:px-8 z-10"
    >
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        
        {/* Animated Header */}
        <div className="mb-20 text-center">
          <SplitText
            text="My Experience"
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase"
            delay={50}
            duration={1}
            ease="power2.out"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <FadeContent blur={true} duration={1} ease="power2.out" initialOpacity={0} delay={400}>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto uppercase tracking-widest font-light">
              A journey of crafting premium digital experiences
            </p>
          </FadeContent>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-3xl flex flex-col items-center">
          
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-slate-800 -translate-x-1/2 shadow-[0_0_15px_rgba(249,115,22,0.3)]"></div>

          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <FadeContent
                key={exp.id}
                blur={true}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0}
                className="w-full"
                delay={index * 200}
              >
                <div className={`relative flex items-center justify-between w-full mb-16 ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                } flex-col md:gap-8`}>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316] -translate-x-1/2 mt-6 md:mt-0 z-10"></div>

                  {/* Empty space for symmetric layout on desktop */}
                  <div className="hidden md:block md:w-5/12"></div>

                  {/* Content Card wrapped in StarBorder */}
                  <div className="w-full md:w-5/12 pl-12 md:pl-0">
                    <StarBorder 
                      as="div" 
                      color="#f97316" 
                      speed={`${3 + index}s`} 
                      className="w-full text-left"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-orange-500 font-mono text-sm tracking-wider">{exp.period}</span>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{exp.role}</h3>
                        <h4 className="text-lg font-medium text-slate-300 uppercase tracking-wide">{exp.company}</h4>
                        <p className="text-slate-400 leading-relaxed mt-2 text-sm sm:text-base">
                          {exp.description}
                        </p>
                      </div>
                    </StarBorder>
                  </div>

                </div>
              </FadeContent>
            );
          })}
        </div>

      </div>
    </section>
  );
}
