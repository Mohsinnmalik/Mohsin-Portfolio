"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ExperienceTimeline.css';

const TIMELINE_DATA = [
    {
        id: "codeflux",
        date: "2024 - Present",
        title: "Technical Head & Founder",
        desc: "Leading CodeFlux, building AI curriculums, and organizing youth-led tech workshops to empower the next generation of developers.",
        images: [
            "/images/showcase/codeflux.png",
            "/images/showcase/vyapar.png",
            "/images/showcase/dochub.png"
        ],
        annotations: [
            { text: "Built AI curriculum", x: -90, y: -200, rotate: -5 },
            { text: "500+ students empowered", x: 130, y: 170, rotate: 6 }
        ]
    },
    {
        id: "hackathon",
        date: "Feb 2026",
        title: "AI/ML Hackathon Participant",
        desc: "Participated in the Widesoftech hackathon, building scalable backend architectures and integrating real-time AI processing units.",
        images: [
            "/images/showcase/vyapar.png",
            "/images/showcase/dochub.png",
            "/images/showcase/codeflux.png"
        ],
        annotations: [
            { text: "Real-time AI inference", x: -130, y: 150, rotate: -3 },
            { text: "Scalable architecture", x: 110, y: -210, rotate: 8 }
        ]
    },
    {
        id: "eduexpo",
        date: "Dec 2025",
        title: "EduExpo Presenter",
        desc: "Pitched AI automation tools for educators and secured sponsorships from major tech firms to expand our educational outreach.",
        images: [
            "/images/showcase/dochub.png",
            "/images/showcase/codeflux.png",
            "/images/showcase/vyapar.png"
        ],
        annotations: [
            { text: "Pitched to tech titans", x: -140, y: -170, rotate: -7 },
            { text: "Secured sponsorships", x: 120, y: 180, rotate: 5 }
        ]
    }
];

export const ExperienceTimeline = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isWheeling, setIsWheeling] = useState(false);
    const scrubberRef = useRef<HTMLDivElement>(null);

    const activeItem = TIMELINE_DATA[activeIndex];
    const nextIndex = (activeIndex + 1) % TIMELINE_DATA.length;
    const nextItem = TIMELINE_DATA[nextIndex];

    const nextStep = () => setActiveIndex((prev) => (prev + 1) % TIMELINE_DATA.length);
    const prevStep = () => setActiveIndex((prev) => (prev - 1 + TIMELINE_DATA.length) % TIMELINE_DATA.length);

    // Mouse Wheel Handler (Debounced)
    const handleWheel = (e: React.WheelEvent) => {
        if (isWheeling) return;
        if (Math.abs(e.deltaY) > 40 || Math.abs(e.deltaX) > 40) {
            setIsWheeling(true);
            if (e.deltaY > 0 || e.deltaX > 0) nextStep();
            else prevStep();
            setTimeout(() => setIsWheeling(false), 900);
        }
    };

    // Drag Handler
    const onDragEnd = (event: any, info: any) => {
        const threshold = 80;
        if (info.offset.x < -threshold) nextStep();
        else if (info.offset.x > threshold) prevStep();
    };

    // Scrubber Sync
    useEffect(() => {
        if (scrubberRef.current) {
            const activeItemEl = scrubberRef.current.children[activeIndex] as HTMLElement;
            if (activeItemEl) {
                const scrollLeft = activeItemEl.offsetLeft - scrubberRef.current.offsetWidth / 2 + activeItemEl.offsetWidth / 2;
                scrubberRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [activeIndex]);

    return (
        <section className="timeline-wrapper" id="experience">
            <div className="flex flex-col items-center w-full mb-16 px-6">
                <motion.span 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-orange-500 font-bold tracking-[0.6em] text-[10px] uppercase mb-4"
                >
                    Milestones
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                >
                    Memory Lane
                </motion.h2>
            </div>

            <motion.div 
                className="timeline-container"
                onWheel={handleWheel}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={onDragEnd}
            >
                <div className="timeline-draggable-canvas">
                    {/* Active Milestone - Left Zone */}
                    <div className="timeline-content-zone">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`content-${activeItem.id}`}
                                initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -60, filter: "blur(10px)" }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="timeline-date">{activeItem.date}</span>
                                <h1 className="timeline-title">{activeItem.title}</h1>
                                <p className="timeline-desc">{activeItem.desc}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Photo Cluster - Center Zone */}
                    <div className="timeline-photo-zone">
                        <div className="photo-cluster">
                            <AnimatePresence mode="popLayout">
                                {activeItem.images.map((img, i) => (
                                    <motion.div
                                        key={`${activeItem.id}-img-${i}`}
                                        initial={{ opacity: 0, scale: 0.6, rotate: i === 1 ? -20 : 20, y: 40 }}
                                        animate={{ 
                                            opacity: 1, 
                                            scale: i === 0 ? 1.15 : 1, 
                                            rotate: i === 0 ? 0 : (i === 1 ? -10 : 8),
                                            x: i === 0 ? 0 : (i === 1 ? -80 : 80),
                                            y: i === 0 ? 0 : 30,
                                            z: i === 0 ? 20 : 0
                                        }}
                                        exit={{ opacity: 0, scale: 0.7, x: i === 1 ? -200 : 200, y: -40 }}
                                        transition={{ duration: 1, type: "spring", bounce: 0.25 }}
                                        className={`polaroid-frame ${i === 0 ? 'main' : ''}`}
                                        style={{ 
                                            zIndex: i === 0 ? 10 : 5,
                                            width: '300px',
                                            height: '380px'
                                        }}
                                    >
                                        <img src={img} alt={activeItem.title} className="polaroid-img" />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Handwritten Annotations */}
                            <AnimatePresence>
                                {activeItem.annotations.map((note, i) => (
                                    <motion.div
                                        key={`${activeItem.id}-note-${i}`}
                                        initial={{ opacity: 0, scale: 0.4, rotate: note.rotate - 12 }}
                                        animate={{ opacity: 1, scale: 1, rotate: note.rotate }}
                                        exit={{ opacity: 0, scale: 0.4 }}
                                        transition={{ duration: 0.7, delay: 0.6 + i * 0.15 }}
                                        className="annotation"
                                        style={{ left: `calc(50% + ${note.x}px)`, top: `calc(45% + ${note.y}px)` }}
                                    >
                                        {note.text}
                                        <svg className="annotation-arrow" width="70" height="70" style={{ position: 'absolute', top: note.y < 0 ? '110%' : '-60px', left: note.x < 0 ? '80%' : '-40px', transform: `scaleX(${note.x < 0 ? '-1' : '1'})` }}>
                                            <path 
                                                d="M10,10 C30,15 45,35 55,60" 
                                                stroke="currentColor" 
                                                strokeWidth="2.5" 
                                                fill="none" 
                                            />
                                        </svg>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Next Peek - Right Zone */}
                    <div className="timeline-peek-zone">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`peek-${nextItem.id}`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 0.25, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                className="flex flex-col"
                            >
                                <span className="timeline-date">{nextItem.date}</span>
                                <h3 className="text-5xl font-black text-white/40 leading-none">{nextItem.title}</h3>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Scrubber Navigation */}
                <div className="timeline-scrubber-track">
                    <div className="timeline-scrubber-inner" ref={scrubberRef}>
                        {TIMELINE_DATA.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={`timeline-scrubber-item ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="timeline-scrubber-thumb" style={{ backgroundImage: `url(${item.images[0]})` }} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default ExperienceTimeline;
