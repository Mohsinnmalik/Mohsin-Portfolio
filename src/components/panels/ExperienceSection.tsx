"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ExperienceSection.css";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    year: "2024",
    role: "Senior AI Engineer",
    company: "Future Systems Corp",
    description: "Leading the development of generative AI architectures and high-performance neural interfaces for enterprise scale applications.",
    impact: "OPTIMIZED NEURAL THROUGHPUT BY 40%",
    bgTone: "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 100%)"
  },
  {
    id: 2,
    year: "2022",
    role: "Full-Stack Architect",
    company: "Nexus Labs",
    description: "Architected distributed cloud systems and premium user experiences with a focus on cinematic motion and technical excellence.",
    impact: "SCALED ARCHITECTURE TO 1M+ USERS",
    bgTone: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.3) 0%, rgba(2, 6, 23, 1) 100%)"
  },
  {
    id: 3,
    year: "2020",
    role: "Frontend Specialist",
    company: "Creative Engine",
    description: "Developed sophisticated UI frameworks and motion languages for industry-leading product launches and digital storytelling.",
    impact: "AWARDED BEST-IN-CLASS UI/UX 2021",
    bgTone: "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.3) 0%, rgba(2, 6, 23, 1) 100%)"
  }
];

export default function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const frames = framesRef.current.filter(Boolean) as HTMLDivElement[];
      if (frames.length === 0) return;

      // Pin the main section
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (frames.length - 1)}`, // Adjusted scroll length
          pin: true,
          scrub: true,
        }
      });

      frames.forEach((frame, i) => {
        // Initial state for all frames except the first
        if (i !== 0) {
          gsap.set(frame, { opacity: 0, visibility: "hidden", y: 40, scale: 1.02 });
        } else {
          gsap.set(frame, { opacity: 1, visibility: "visible", y: 0, scale: 1 });
        }

        // Sequential cross-fades
        if (i < frames.length - 1) {
          const nextFrame = frames[i + 1];
          const frameDuration = 1;
          const pos = i * frameDuration;

          // Outgoing Animation (Current Frame)
          mainTl.add(gsap.to(frame, {
            opacity: 0,
            y: -40,
            scale: 0.98,
            duration: frameDuration,
            onComplete: () => { gsap.set(frame, { visibility: "hidden" }); },
            onReverseComplete: () => { gsap.set(frame, { visibility: "visible" }); },
          }), pos);

          // Incoming Animation (Next Frame)
          mainTl.add(gsap.fromTo(nextFrame, 
            { opacity: 0, visibility: "hidden", y: 40, scale: 1.02 },
            {
              opacity: 1,
              visibility: "visible",
              y: 0,
              scale: 1,
              duration: frameDuration,
            }
          ), pos);

          // Staggered text entrance for the next frame
          const title = nextFrame.querySelector('.frame-role');
          const org = nextFrame.querySelector('.frame-org');
          const desc = nextFrame.querySelector('.frame-description');
          const impact = nextFrame.querySelector('.frame-impact');

          if (title && org && desc && impact) {
            mainTl.add(gsap.from([title, org, desc, impact], {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.4,
              ease: "power2.out"
            }), pos + 0.3);
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="experience" className="experience-section">
      <div className="experience-frames-container">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            ref={(el) => { framesRef.current[idx] = el; }}
            className="experience-frame"
            style={{ zIndex: experiences.length - idx }}
          >
            {/* Background Tone Shift */}
            <div 
              className="frame-bg" 
              style={{ background: exp.bgTone }} 
            />
            
            {/* Massive Background Year */}
            <div className="frame-year-bg">{exp.year}</div>

            {/* Foreground Content */}
            <div className="frame-content">
              <h3 className="frame-role">{exp.role}</h3>
              <h4 className="frame-org">{exp.company}</h4>
              <p className="frame-description">{exp.description}</p>
              <div className="frame-impact">
                <span>IMPACT:</span> {exp.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
