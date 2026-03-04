"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './ShowcaseSection.css';

const SHOWCASE_DATA = [
    {
        id: "codeflux",
        subheading: "EdTech Startup",
        headline: "CODEFLUX",
        image: "/images/showcase/codeflux.png",
        description: "A comprehensive platform redesigning the educational experience through high-end interactive curriculum and AI-driven insights."
    },
    {
        id: "vyapar-chat",
        subheading: "AI for MSMEs",
        headline: "VYAPAR-CHAT",
        image: "/images/showcase/vyapar.png",
        description: "Empowering small businesses with intelligent chat interfaces that automate sales, support, and business management workflows."
    },
    {
        id: "dochub",
        subheading: "Resource Platform",
        headline: "ANJUMAN DOC HUB",
        image: "/images/showcase/dochub.png",
        description: "A sophisticated resource hub built for rapid knowledge dissemination and document lifecycle management at scale."
    }
];

export const ShowcaseSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const activeItem = SHOWCASE_DATA[activeIndex];

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % SHOWCASE_DATA.length);
        }, 7000); // 7-second timer as requested
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    useEffect(() => {
        if (isAutoPlaying) {
            startTimer();
        }
        return () => stopTimer();
    }, [isAutoPlaying]); // Re-run when play state changes

    const handleNext = () => {
        setIsAutoPlaying(false); // Pause auto-play on manual interact
        setActiveIndex((prev) => (prev + 1) % SHOWCASE_DATA.length);
    };

    const handlePrev = () => {
        setIsAutoPlaying(false); // Pause auto-play on manual interact
        setActiveIndex((prev) => (prev - 1 + SHOWCASE_DATA.length) % SHOWCASE_DATA.length);
    };

    const handleCardClick = (index: number) => {
        setIsAutoPlaying(false); // Pause auto-play on manual interact
        setActiveIndex(index);
    };

    // Auto-scroll carousel active item into view
    useEffect(() => {
        if (carouselRef.current) {
            const activeCard = carouselRef.current.children[activeIndex] as HTMLElement;
            if (activeCard) {
                const scrollLeft = activeCard.offsetLeft - carouselRef.current.offsetWidth / 2 + activeCard.offsetWidth / 2;
                carouselRef.current.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeIndex]);

    return (
        <section className="showcase-wrapper" id="projects">
            <div className="flex flex-col items-center w-full">
                {/* Section Heading */}
                <div className="mb-10 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-xs uppercase tracking-[0.5em] text-slate-500 font-bold mb-3"
                    >
                        Portfolio
                    </motion.h2>
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        My Projects
                    </motion.h3>
                </div>

                <div className="showcase-container">
                    {/* Background Layer */}
                    <div className="showcase-bg-container">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }} // Netflix-style smooth fade
                                className="showcase-bg"
                                style={{ backgroundImage: `url(${activeItem.image})` }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Overlay Layer */}
                    <div className="showcase-overlay" />

                    {/* Main Content Area */}
                    <div className="showcase-content">
                        <div className="overflow-hidden">
                            <motion.span
                                key={`sub-${activeItem.id}`}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="showcase-subheading"
                            >
                                {activeItem.subheading}
                            </motion.span>
                        </div>

                        <div className="overflow-hidden">
                            <motion.h2
                                key={`head-${activeItem.id}`}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="showcase-headline"
                            >
                                {activeItem.headline}
                            </motion.h2>
                        </div>

                        <div className="flex items-center gap-4">
                            <motion.button
                                key={`cta-${activeItem.id}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="showcase-cta"
                            >
                                View Project
                                <ArrowRight size={16} />
                            </motion.button>
                            
                            {/* Auto-play Visual Indicator (Progress bar could be added here later) */}
                            {isAutoPlaying && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hidden md:block w-32 h-1 bg-white/10 rounded-full overflow-hidden"
                                >
                                    <motion.div 
                                        key={activeIndex}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 7, ease: "linear" }}
                                        className="h-full bg-[#f97316]"
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Carousel & Controls */}
                    <div className="showcase-carousel-wrapper">
                        <div className="showcase-carousel" ref={carouselRef}>
                            {SHOWCASE_DATA.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`showcase-card ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div 
                                        className="showcase-card-img" 
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    <div className="showcase-card-overlay">
                                        <span className="showcase-card-title">{item.id.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="showcase-controls">
                            <button 
                                className="showcase-control-btn" 
                                onClick={handlePrev}
                                aria-label="Previous Project"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <button 
                                className="showcase-control-btn" 
                                onClick={handleNext}
                                aria-label="Next Project"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
