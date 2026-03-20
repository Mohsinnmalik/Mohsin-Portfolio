"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ExperienceTimeline.css';

const TIMELINE_DATA = [
    {
        id: "codesoft-web",
        date: "2023",
        title: "Web Development Intern",
        desc: "Completed intensive internship at CodeSoft focused on frontend development, responsive UI design, and real-world website deployment practices using modern web standards.",
        images: [
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "First professional code", x: -100, y: -180, rotate: -5 },
            { text: "Responsive UI master", x: 120, y: 160, rotate: 4 }
        ]
    },
    {
        id: "codesoft-ds",
        date: "2023",
        title: "Data Science Intern",
        desc: "Executed data analysis projects during fellowship at CodeSoft, exploring machine learning fundamentals and building basic predictive models using Python and statistical libraries.",
        images: [
            "https://images.unsplash.com/photo-1551288049-bbda38a10ad5?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Python & Pandas fun", x: -130, y: 140, rotate: -8 },
            { text: "Modeling real data", x: 100, y: -200, rotate: 6 }
        ]
    },
    {
        id: "prodigy-web",
        date: "2024",
        title: "Web Development Intern",
        desc: "Developed modern web interfaces at Prodigy Infotech, significantly improving full-stack workflow understanding, including API integration, server-side logic, and scalable deployments.",
        images: [
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Full stack jump", x: -90, y: -160, rotate: -3 },
            { text: "API integrations refined", x: 140, y: 180, rotate: 7 }
        ]
    },
    {
        id: "game-research",
        date: "2024",
        title: "Business Research Intern",
        desc: "Collaborated with Global Alliance for Mass Entrepreneurship (GAME) to conduct market research and analyze startup ecosystems, contributing key insights on scalable business strategies.",
        images: [
            "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1461280360983-bd93eaa50516?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Startup ecosystems", x: -150, y: 120, rotate: -6 },
            { text: "Impactful research", x: 110, y: -190, rotate: 5 }
        ]
    },
    {
        id: "codeflux-founder",
        date: "2025",
        title: "Founder & Full Stack Developer",
        desc: "Founded CodeFlux, a student-driven EdTech initiative focused on delivering AI workshops, intensive tech training programs, and hands-on product development experiences for the youth.",
        images: [
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Born to Build", x: -120, y: -200, rotate: -4 },
            { text: "Empowering techies", x: 130, y: 150, rotate: 6 }
        ]
    },
    {
        id: "ai-workshop",
        date: "2025",
        title: "National AI Workshop Presenter",
        desc: "Led nationwide sessions via the CodeFlux Initiative, introducing educators and students to advanced AI productivity tools and modern technology adoption strategies.",
        images: [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "AI is the Future", x: -140, y: 160, rotate: -7 },
            { text: "Nationwide Impact", x: 100, y: -220, rotate: 8 }
        ]
    },
    {
        id: "robotics-iitb",
        date: "2025",
        title: "Robotics Workshop Organizer",
        desc: "Coordinated technology awareness sessions and hands-on robotics workshops in collaboration with IIT Bombay, promoting engineering innovation among aspiring students.",
        images: [
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1561557944-6eda78622880?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Collaborated with IITB", x: -110, y: -150, rotate: -5 },
            { text: "Robotics & Innovation", x: 120, y: 190, rotate: 4 }
        ]
    },
    {
        id: "eduexpo-pitch",
        date: "2025",
        title: "EduExpo Presenter",
        desc: "Pitched AI automation solutions designed for the education sector at institutional tech events, successfully securing sponsorship interest and resource partnerships.",
        images: [
            "https://images.unsplash.com/photo-1475721027785-f74dea327912?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "The Big Pitch", x: -130, y: 170, rotate: -6 },
            { text: "Secured Sponsorship", x: 140, y: -210, rotate: 7 }
        ]
    },
    {
        id: "independent-projects",
        date: "2026",
        title: "Full Stack & AI Product Builder",
        desc: "Developing multiple AI-integrated web platforms independently, including sophisticated document automation systems, civic-tech solutions, and next-gen productivity tools.",
        images: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800"
        ],
        annotations: [
            { text: "Obsessed with Creation", x: -120, y: -190, rotate: -4 },
            { text: "AI-Integrated Apps", x: 110, y: 150, rotate: 5 }
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
