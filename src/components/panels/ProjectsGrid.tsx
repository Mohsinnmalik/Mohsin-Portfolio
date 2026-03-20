"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

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

const ProjectCard = ({ project, index }: { project: ShowcaseItem; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
            className="group relative flex flex-col bg-[#0f1525] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500 shadow-2xl"
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                    src={project.image} 
                    alt={project.headline}
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
                    
                    <button className="flex items-center gap-2 group/btn text-orange-500 font-bold text-xs uppercase tracking-[0.2em] hover:text-orange-400 transition-colors">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
                    {SHOWCASE_DATA.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsGrid;
