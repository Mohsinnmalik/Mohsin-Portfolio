"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { gsap } from 'gsap';
import { ANIMATION, containerVariants, itemVariants } from '@/lib/animation-config';

interface ShowcaseItem {
    id: string;
    subheading: string;
    headline: string;
    image: string;
    description: string;
    tech: string[];
    link: string;
    github?: string;
    live?: string;
}

const SHOWCASE_DATA: ShowcaseItem[] = [
    {
        id: "codeflux",
        subheading: "EdTech Startup",
        headline: "CODEFLUX",
        image: "/images/showcase/codeflux.png",
        description: "A comprehensive platform redesigning the educational experience through high-end interactive curriculum and AI-driven insights.",
        tech: ["Next.js", "TypeScript", "OpenAI", "Tailwind"],
        link: "#",
        github: "#",
        live: "#"
    },
    {
        id: "vyapar-chat",
        subheading: "AI for MSMEs",
        headline: "VYAPAR-CHAT",
        image: "/images/showcase/vyapar.png",
        description: "Empowering small businesses with intelligent chat interfaces that automate sales, support, and business management workflows.",
        tech: ["React", "Python", "FastAPI", "PostgreSQL"],
        link: "#",
        github: "#",
        live: "#"
    },
    {
        id: "dochub",
        subheading: "Resource Platform",
        headline: "ANJUMAN DOC HUB",
        image: "/images/showcase/dochub.png",
        description: "A sophisticated resource hub built for rapid knowledge dissemination and document lifecycle management at scale.",
        tech: ["Next.js", "Prisma", "AWS", "Node.js"],
        link: "#",
        github: "#",
        live: "#"
    },
    {
        id: "nexus",
        subheading: "Data Insights",
        headline: "NEXUS AI",
        image: "/images/showcase/nexus.png",
        description: "A high-end analytics dashboard providing real-time data visualization and predictive modeling for enterprise scale.",
        tech: ["Three.js", "React", "D3.js", "Firebase"],
        link: "#",
        github: "#",
        live: "#"
    },
    {
        id: "flux-studio",
        subheading: "Design Collective",
        headline: "FLUX STUDIO",
        image: "/images/showcase/flux.png",
        description: "A digital canvas for high-end creative direction, blending architecture and minimalism into immersive portfolios.",
        tech: ["GSAP", "Next.js", "Vercel", "Stripe"],
        link: "#",
        github: "#",
        live: "#"
    }
];

// UI: Magnetic hover effect — exact math from Patch §5
function useMagneticButton() {
    const ref = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(ref.current, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    return { ref, handleMouseMove, handleMouseLeave };
}

const ProjectCard = ({ project }: { project: ShowcaseItem }) => {
    // UI: Magnetic effect on the CTA button (Patch §5 — exact spec)
    const magnetic = useMagneticButton();

    return (
        // UI: itemVariants provides staggered entrance — no blur, scale+opacity only
        <motion.div
            variants={itemVariants}
            className="group relative flex flex-col bg-[#0f1525] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500 shadow-2xl"
            style={{ willChange: 'transform, opacity' }}
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.headline}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1525] via-transparent to-transparent opacity-60" />

                {/* Floating Tech Tags (Overlay) */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    {project.tech.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white/90 border border-white/10 uppercase tracking-tighter">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-8 md:p-10 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-orange-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2 block font-bold">
                            {project.subheading}
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                            {project.headline}
                        </h3>
                    </div>
                </div>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 flex-1 font-light">
                    {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-4">
                        <a href={project.github} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-orange-500/50 transition-all">
                            <Github size={18} />
                        </a>
                        <a href={project.live} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-orange-500/50 transition-all">
                            <ExternalLink size={18} />
                        </a>
                    </div>

                    {/* UI: Magnetic CTA button — warps toward cursor on hover (Patch §5) */}
                    <button
                        ref={magnetic.ref}
                        onMouseMove={magnetic.handleMouseMove}
                        onMouseLeave={magnetic.handleMouseLeave}
                        className="flex items-center gap-2 group/btn text-orange-500 font-bold text-xs uppercase tracking-[0.2em] hover:text-orange-400 transition-colors"
                        style={{ willChange: 'transform' }}
                    >
                        View Details
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Subtle Reflection Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </motion.div>
    );
};

export const ProjectsGrid = () => {
    return (
        <section id="projects" className="bg-[#0a0f1d] pb-32 pt-10">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* UI: containerVariants drives staggerChildren — cards animate in sequence, not all at once */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14"
                >
                    {SHOWCASE_DATA.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectsGrid;
